import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { ArmorIQ } from '../utils/armorIQ';

const router = Router();

// GET all employees
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const employees = await db.employees.findMany({
      include: { tasks: true }
    });
    return res.json(employees);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET single employee details with tasks
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await db.employees.findUnique({
      where: { id },
      include: { tasks: true }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.json(employee);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST create new employee & auto-provision onboarding tasks
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { firstName, lastName, email, department, role, startDate } = req.body;

    if (!firstName || !lastName || !email || !department || !role || !startDate) {
      return res.status(400).json({ error: 'Missing required employee fields' });
    }

    // Determine initial base scores based on roles
    let initialRisk = 25;
    if (department.toLowerCase() === 'engineering' || role.toLowerCase().includes('devops') || role.toLowerCase().includes('security')) {
      initialRisk = 65; // higher access privileges = higher initial compliance risk until audited
    }

    const employee = await db.employees.create({
      data: {
        firstName,
        lastName,
        email,
        department,
        role,
        startDate: new Date(startDate),
        riskScore: initialRisk,
        complianceScore: 0,
        status: 'ONBOARDING'
      }
    });

    // Auto-provision standard & role-specific tasks
    const tasksToCreate = [
      {
        title: 'Sign NDA & Code of Conduct',
        description: 'Review and sign company confidentiality agreement and code of conduct.',
        category: 'DOCUMENT',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Complete Security Awareness Training',
        description: 'Complete baseline security awareness curriculum in OnboardIQ LMS portal.',
        category: 'TRAINING',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Enforce MDM Device Encryption',
        description: 'Enroll primary work laptop in corporate Mobile Device Management and enable hard drive encryption.',
        category: 'IT_SETUP',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      }
    ];

    // Role-specific/Department-specific tasks
    if (department.toLowerCase() === 'engineering' || department.toLowerCase() === 'it' || role.toLowerCase().includes('devops')) {
      tasksToCreate.push({
        title: 'AWS IAM Least Privilege Consent',
        description: 'Register MFA credentials and accept the corporate IAM access governance statement.',
        category: 'SECURITY',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      });
      tasksToCreate.push({
        title: 'Background Screening Clearance',
        description: 'Critical background and reference screening validation check.',
        category: 'SECURITY',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      });
    }

    if (department.toLowerCase() === 'sales' || department.toLowerCase() === 'marketing' || department.toLowerCase() === 'hr') {
      tasksToCreate.push({
        title: 'GDPR & Privacy Compliance Training',
        description: 'Review handling standards for customer Personal Identifiable Information (PII).',
        category: 'TRAINING',
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      });
    }

    // Create all tasks in DB
    for (const t of tasksToCreate) {
      await db.tasks.create({
        data: {
          employeeId: employee.id,
          title: t.title,
          description: t.description,
          category: t.category,
          dueDate: t.dueDate,
          status: 'PENDING'
        }
      });
    }

    // 1. ArmorIQ Secure Audit Logging
    await ArmorIQ.logAudit(
      req.user?.name || 'HR Portal',
      req.user?.id || 'system',
      'EMPLOYEE_PROVISIONED',
      `Successfully created corporate identity for ${firstName} ${lastName} (${role}). Generated ${tasksToCreate.length} compliance tasks.`,
      'INFO'
    );

    // If high risk department, flag critical log alert
    if (initialRisk > 50) {
      await ArmorIQ.logAudit(
        'Compliance Monitor',
        'system',
        'HIGH_INITIAL_RISK_POSTURE',
        `High initial risk rating (65%) assigned to new DevOps/Engineering hire: ${firstName} ${lastName}. Workflow validation mandated.`,
        'WARNING'
      );
    }

    // Return the newly created employee with tasks
    const fullEmployee = await db.employees.findUnique({
      where: { id: employee.id },
      include: { tasks: true }
    });

    return res.status(201).json(fullEmployee);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT update single onboarding task status
router.put('/tasks/:taskId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body; // 'PENDING' or 'COMPLETED'

    if (!status || !['PENDING', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status ("PENDING" or "COMPLETED") is required' });
    }

    const task = await db.tasks.update({
      where: { id: taskId as string },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null
      }
    });

    // Fetch updated employee details
    const employee = await db.employees.findUnique({
      where: { id: task.employeeId },
      include: { tasks: true }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // 2. ArmorIQ Secure Workflow Compliance Validation
    const workflowCheck = ArmorIQ.validateWorkflow(employee);
    
    // 3. ArmorIQ Secure Audit Logging
    await ArmorIQ.logAudit(
      req.user?.name || 'OnboardIQ Portal',
      req.user?.id || 'system',
      'TASK_STATUS_MUTATED',
      `Marked compliance task '${task.title}' as ${status} for employee ${employee.firstName} ${employee.lastName}.`,
      workflowCheck.isValid ? 'INFO' : 'WARNING'
    );

    // If workflow has compliance errors, alert via ArmorIQ logs
    if (!workflowCheck.isValid) {
      await ArmorIQ.logAudit(
        'ArmorIQ Workflow Engine',
        'system',
        'COMPLIANCE_POLICY_ALERT',
        `Access authorization delayed for ${employee.firstName} ${employee.lastName}. Failure detail: ${workflowCheck.failures.join(', ')}`,
        'WARNING'
      );
    }

    return res.json(task);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE single employee
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await db.employees.findUnique({ where: { id: id as string } });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await db.employees.delete({ where: { id: id as string } });

    // 4. ArmorIQ Secure Audit Logging
    await ArmorIQ.logAudit(
      req.user?.name || 'HR Portal',
      req.user?.id || 'system',
      'EMPLOYEE_RECORD_DELETED',
      `Permanently purged corporate account and database checklist state for employee: ${employee.firstName} ${employee.lastName}.`,
      'WARNING'
    );

    return res.json({ message: 'Employee successfully removed', deletedId: id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
