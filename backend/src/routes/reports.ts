import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET all activity logs (audit logs)
router.get('/logs', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { severity } = req.query;
    let logs = await db.activityLogs.findMany();
    
    if (severity) {
      logs = logs.filter((log: any) => log.severity === severity);
    }
    
    return res.json(logs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET CSV/Excel simulation data
router.get('/export', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const employees = await db.employees.findMany({ include: { tasks: true } });
    
    const exportData = employees.map((emp: any) => {
      const pendingTasks = emp.tasks.filter((t: any) => t.status === 'PENDING').map((t: any) => t.title).join('; ');
      return {
        id: emp.id,
        fullName: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        department: emp.department,
        role: emp.role,
        status: emp.status,
        complianceScore: `${emp.complianceScore}%`,
        riskScore: `${emp.riskScore}%`,
        startDate: emp.startDate.toISOString().split('T')[0],
        pendingComplianceTasks: pendingTasks || 'None'
      };
    });

    await db.activityLogs.create({
      data: {
        userId: req.user?.id || 'system',
        userName: req.user?.name || 'OnboardIQ Portal',
        action: 'REPORT_EXPORT',
        details: `Exported comprehensive organizational compliance report for ${employees.length} employees.`,
        severity: 'INFO'
      }
    });

    return res.json(exportData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
