import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET compliance stats summary
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const employees = await db.employees.findMany();
    const tasks = await db.tasks.findMany();
    const audits = await db.securityAudits.findMany();

    const totalEmployees = employees.length;
    const activeOnboarding = employees.filter((e: any) => e.status === 'ONBOARDING').length;
    
    // Average scores
    const avgCompliance = totalEmployees > 0 
      ? Math.round(employees.reduce((acc: number, curr: any) => acc + curr.complianceScore, 0) / totalEmployees)
      : 100;

    const avgRisk = totalEmployees > 0 
      ? Math.round(employees.reduce((acc: number, curr: any) => acc + curr.riskScore, 0) / totalEmployees)
      : 0;

    // High risk employees threshold > 50
    const highRiskCount = employees.filter((e: any) => e.riskScore > 50).length;

    // Task counts
    const pendingTasks = tasks.filter((t: any) => t.status === 'PENDING').length;
    const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;

    // Frame work scores
    const soc2Score = Math.round(
      audits.filter((a: any) => a.category === 'SOC2').reduce((acc: number, curr: any) => acc + curr.score, 0) / 
      (audits.filter((a: any) => a.category === 'SOC2').length || 1)
    );

    const isoScore = Math.round(
      audits.filter((a: any) => a.category === 'ISO27001').reduce((acc: number, curr: any) => acc + curr.score, 0) / 
      (audits.filter((a: any) => a.category === 'ISO27001').length || 1)
    );

    const gdprScore = Math.round(
      audits.filter((a: any) => a.category === 'GDPR').reduce((acc: number, curr: any) => acc + curr.score, 0) / 
      (audits.filter((a: any) => a.category === 'GDPR').length || 1)
    );

    return res.json({
      organizationOverview: {
        totalEmployees,
        activeOnboarding,
        averageCompliance: avgCompliance,
        averageRisk: avgRisk,
        highRiskEmployees: highRiskCount
      },
      taskProgress: {
        total: tasks.length,
        pending: pendingTasks,
        completed: completedTasks,
        completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 100
      },
      frameworkCompliance: {
        soc2: soc2Score,
        iso27001: isoScore,
        gdpr: gdprScore,
        overallScore: Math.round((soc2Score + isoScore + gdprScore) / 3)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET all compliance audits list
router.get('/audits', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const audits = await db.securityAudits.findMany();
    return res.json(audits);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST request manual compliance scan / audit
router.post('/audits/trigger', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category } = req.body; // 'SOC2', 'ISO27001', 'GDPR', 'INTERNAL'
    
    if (!category || !['SOC2', 'ISO27001', 'GDPR', 'INTERNAL'].includes(category)) {
      return res.status(400).json({ error: 'Valid compliance category required' });
    }

    // Trigger mock scanning logic: re-evaluate employee training completion
    const employees = await db.employees.findMany({ include: { tasks: true } });
    
    let compliantCount = 0;
    let totalScanned = 0;

    for (const emp of employees) {
      const relevantTasks = emp.tasks.filter((t: any) => {
        if (category === 'GDPR') return t.title.includes('Privacy') || t.title.includes('GDPR');
        if (category === 'SOC2') return t.title.includes('NDA') || t.category === 'SECURITY';
        if (category === 'ISO27001') return t.category === 'IT_SETUP' || t.category === 'SECURITY';
        return true; // INTERNAL
      });

      if (relevantTasks.length > 0) {
        totalScanned++;
        const completed = relevantTasks.filter((t: any) => t.status === 'COMPLETED').length;
        if (completed === relevantTasks.length) {
          compliantCount++;
        }
      }
    }

    const calculatedScore = totalScanned > 0 ? Math.round((compliantCount / totalScanned) * 100) : 100;
    let status = 'PASSED';
    if (calculatedScore < 80) status = 'WARNING';
    if (calculatedScore < 50) status = 'FAILED';

    const newAudit = await db.securityAudits.create({
      data: {
        category,
        title: `Automated ${category} Compliance Audit`,
        description: `Re-calculated real-time audit across ${totalScanned} employees. Score determined: ${calculatedScore}%.`,
        status,
        score: calculatedScore
      }
    });

    // Record Action
    await db.activityLogs.create({
      data: {
        userId: req.user?.id || 'system',
        userName: req.user?.name || 'Security Monitor',
        action: 'COMPLIANCE_SCAN',
        details: `Triggered compliance audit scan for ${category}. Audit score finalized: ${calculatedScore}% (${status}).`,
        severity: status === 'FAILED' ? 'CRITICAL' : (status === 'WARNING' ? 'WARNING' : 'INFO')
      }
    });

    return res.status(201).json(newAudit);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
