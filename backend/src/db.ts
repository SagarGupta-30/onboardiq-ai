import { PrismaClient } from '@prisma/client';

let prisma: any;
let isMock = false;

if (process.env.DATABASE_URL) {
  try {
    prisma = new PrismaClient();
  } catch (error) {
    console.warn("Prisma failed to initialize, falling back to mock database:", error);
    isMock = true;
  }
} else {
  isMock = true;
}

// Rich Mock In-Memory Database for flawless zero-config operations
export const mockStore = {
  users: [
    {
      id: "u1",
      email: "admin@onboardiq.ai",
      password: "$2a$10$XFkQ8wU2WvXj0/Gk2o9NVeD11z6nC4jX1uJc6gB8k9Wd8vXj0/Gk2", // "password" encrypted
      name: "Sarah Jenkins",
      role: "HR",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "u2",
      email: "security@onboardiq.ai",
      password: "$2a$10$XFkQ8wU2WvXj0/Gk2o9NVeD11z6nC4jX1uJc6gB8k9Wd8vXj0/Gk2", // "password"
      name: "Marcus Vance",
      role: "SECURITY_OFFICER",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as any[],

  employees: [
    {
      id: "emp-1",
      firstName: "Alex",
      lastName: "Rivera",
      email: "alex.rivera@onboardiq-client.com",
      department: "Engineering",
      role: "Frontend Engineer",
      status: "ONBOARDING",
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      riskScore: 35,
      complianceScore: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "emp-2",
      firstName: "Sophia",
      lastName: "Chen",
      email: "sophia.chen@onboardiq-client.com",
      department: "Product",
      role: "Product Manager",
      status: "ONBOARDING",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      riskScore: 12,
      complianceScore: 80,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "emp-3",
      firstName: "Jordan",
      lastName: "Smith",
      email: "jordan.smith@onboardiq-client.com",
      department: "Sales",
      role: "Enterprise Account Executive",
      status: "ACTIVE",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      riskScore: 8,
      complianceScore: 100,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: "emp-4",
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@onboardiq-client.com",
      department: "Engineering",
      role: "DevOps Specialist",
      status: "ONBOARDING",
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      riskScore: 78,
      complianceScore: 40,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as any[],

  tasks: [
    // Alex Rivera's Tasks
    {
      id: "t1",
      employeeId: "emp-1",
      title: "Sign NDA & Code of Conduct",
      description: "Review and sign the company confidentiality agreements and code of conduct document.",
      category: "DOCUMENT",
      status: "COMPLETED",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "t2",
      employeeId: "emp-1",
      title: "Complete Security Awareness Training",
      description: "Complete the initial 45-minute baseline security awareness course and pass the assessment quiz.",
      category: "TRAINING",
      status: "PENDING",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "t3",
      employeeId: "emp-1",
      title: "Provision MDM & Laptop Setup",
      description: "Install corporate mobile device management agent and set up hard drive encryption (FileVault).",
      category: "IT_SETUP",
      status: "PENDING",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Sophia Chen's Tasks
    {
      id: "t4",
      employeeId: "emp-2",
      title: "Sign NDA & Code of Conduct",
      description: "Review and sign the company confidentiality agreements and code of conduct document.",
      category: "DOCUMENT",
      status: "COMPLETED",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "t5",
      employeeId: "emp-2",
      title: "Verify Background Check",
      description: "Submit documentation for compliance verification via background check portal.",
      category: "SECURITY",
      status: "COMPLETED",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "t6",
      employeeId: "emp-2",
      title: "Configure 2FA on Password Manager",
      description: "Complete setup for corporate 1Password account and enforce multi-factor authentication.",
      category: "SECURITY",
      status: "PENDING",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // David Kim's Tasks (DevOps - high risk due to sensitive infrastructure access)
    {
      id: "t7",
      employeeId: "emp-4",
      title: "AWS IAM & MFA Policy Consent",
      description: "Acknowledge least-privilege policies and register hardware security key (YubiKey) for cloud consoles.",
      category: "SECURITY",
      status: "PENDING",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "t8",
      employeeId: "emp-4",
      title: "Background Screening Clearance",
      description: "Criminal record and identity verification check for high-privilege access authorization.",
      category: "SECURITY",
      status: "PENDING",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as any[],

  securityAudits: [
    {
      id: "sa-1",
      category: "SOC2",
      title: "Employee Background Checks",
      description: "Verify that all onboarding personnel have completed identity and criminal history audits prior to system provisioning.",
      status: "WARNING",
      score: 75,
      checkedAt: new Date()
    },
    {
      id: "sa-2",
      category: "ISO27001",
      title: "Access Control & Enforced MFA",
      description: "Confirm that all active employee accounts have configured and actively use multi-factor authentication.",
      status: "PASSED",
      score: 100,
      checkedAt: new Date()
    },
    {
      id: "sa-3",
      category: "GDPR",
      title: "Data Processing Training",
      description: "Ensure that staff dealing with customer personal data have finished GDPR compliance training modules.",
      status: "FAILED",
      score: 40,
      checkedAt: new Date()
    },
    {
      id: "sa-4",
      category: "INTERNAL",
      title: "MDM Device Encryption",
      description: "Assess corporate laptops to verify that FileVault or BitLocker storage encryption is enabled.",
      status: "PASSED",
      score: 95,
      checkedAt: new Date()
    }
  ] as any[],

  activityLogs: [
    {
      id: "al-1",
      userId: "u1",
      userName: "Sarah Jenkins",
      action: "EMPLOYEE_CREATE",
      details: "Initiated onboarding sequence for Alex Rivera (Frontend Engineer).",
      severity: "INFO",
      timestamp: new Date(Date.now() - 3 * 3600 * 1000)
    },
    {
      id: "al-2",
      userId: "u1",
      userName: "Sarah Jenkins",
      action: "EMPLOYEE_CREATE",
      details: "Initiated onboarding sequence for David Kim (DevOps Specialist).",
      severity: "INFO",
      timestamp: new Date(Date.now() - 2 * 3600 * 1000)
    },
    {
      id: "al-3",
      userId: "system",
      userName: "Security Monitor",
      action: "COMPLIANCE_ALERT",
      details: "David Kim is flag-marked as HIGH RISK due to missing YubiKey enrollment and background screening latency.",
      severity: "CRITICAL",
      timestamp: new Date(Date.now() - 1.5 * 3600 * 1000)
    },
    {
      id: "al-4",
      userId: "u2",
      userName: "Marcus Vance",
      action: "TASK_COMPLETE",
      details: "Marked Sophia Chen's task 'Verify Background Check' as completed.",
      severity: "INFO",
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
  ] as any[],

  chatMessages: [] as any[]
};

// Unified Database API
export const db = {
  isMocked: () => isMock,

  users: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      if (isMock) {
        return mockStore.users.find(u => u.email === where.email) || null;
      }
      return prisma.user.findUnique({ where });
    },
    findFirst: async ({ where }: { where: { id: string } }) => {
      if (isMock) {
        return mockStore.users.find(u => u.id === where.id) || null;
      }
      return prisma.user.findFirst({ where });
    },
    create: async ({ data }: { data: any }) => {
      if (isMock) {
        const newUser = {
          id: `u-${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockStore.users.push(newUser);
        return newUser;
      }
      return prisma.user.create({ data });
    }
  },

  employees: {
    findMany: async (args?: any) => {
      if (isMock) {
        let list = [...mockStore.employees];
        if (args?.include?.tasks) {
          list = list.map(emp => ({
            ...emp,
            tasks: mockStore.tasks.filter(t => t.employeeId === emp.id)
          }));
        }
        return list;
      }
      return prisma.employee.findMany(args);
    },
    findUnique: async (args: any) => {
      const id = args.where.id;
      if (isMock) {
        const emp = mockStore.employees.find(e => e.id === id);
        if (!emp) return null;
        if (args.include?.tasks) {
          return {
            ...emp,
            tasks: mockStore.tasks.filter(t => t.employeeId === emp.id)
          };
        }
        return emp;
      }
      return prisma.employee.findUnique(args);
    },
    create: async ({ data }: { data: any }) => {
      if (isMock) {
        const newEmp = {
          id: `emp-${Math.random().toString(36).substr(2, 9)}`,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          department: data.department,
          role: data.role,
          status: data.status || "ONBOARDING",
          startDate: new Date(data.startDate),
          riskScore: data.riskScore || 25,
          complianceScore: data.complianceScore || 50,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockStore.employees.push(newEmp);
        return newEmp;
      }
      return prisma.employee.create({ data });
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      if (isMock) {
        const index = mockStore.employees.findIndex(e => e.id === where.id);
        if (index === -1) throw new Error("Employee not found");
        mockStore.employees[index] = {
          ...mockStore.employees[index],
          ...data,
          updatedAt: new Date()
        };
        return mockStore.employees[index];
      }
      return prisma.employee.update({ where, data });
    },
    delete: async ({ where }: { where: { id: string } }) => {
      if (isMock) {
        const index = mockStore.employees.findIndex(e => e.id === where.id);
        if (index === -1) throw new Error("Employee not found");
        const emp = mockStore.employees[index];
        mockStore.employees.splice(index, 1);
        mockStore.tasks = mockStore.tasks.filter(t => t.employeeId !== where.id);
        return emp;
      }
      return prisma.employee.delete({ where });
    }
  },

  tasks: {
    findMany: async (args?: any) => {
      if (isMock) {
        const employeeId = args?.where?.employeeId;
        if (employeeId) {
          return mockStore.tasks.filter(t => t.employeeId === employeeId);
        }
        return mockStore.tasks;
      }
      return prisma.onboardingTask.findMany(args);
    },
    create: async ({ data }: { data: any }) => {
      if (isMock) {
        const newTask = {
          id: `t-${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          status: data.status || "PENDING",
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockStore.tasks.push(newTask);
        recalculateScores(newTask.employeeId);
        return newTask;
      }
      return prisma.onboardingTask.create({ data });
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      if (isMock) {
        const index = mockStore.tasks.findIndex(t => t.id === where.id);
        if (index === -1) throw new Error("Task not found");
        mockStore.tasks[index] = {
          ...mockStore.tasks[index],
          ...data,
          updatedAt: new Date()
        };
        recalculateScores(mockStore.tasks[index].employeeId);
        return mockStore.tasks[index];
      }
      return prisma.onboardingTask.update({ where, data });
    }
  },

  securityAudits: {
    findMany: async (args?: any) => {
      if (isMock) {
        return mockStore.securityAudits;
      }
      return prisma.securityAudit.findMany(args);
    },
    create: async ({ data }: { data: any }) => {
      if (isMock) {
        const audit = {
          id: `sa-${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          checkedAt: new Date()
        };
        mockStore.securityAudits.push(audit);
        return audit;
      }
      return prisma.securityAudit.create({ data });
    }
  },

  activityLogs: {
    findMany: async (args?: any) => {
      if (isMock) {
        return [...mockStore.activityLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }
      return prisma.activityLog.findMany({
        ...args,
        orderBy: { timestamp: 'desc' }
      });
    },
    create: async ({ data }: { data: any }) => {
      if (isMock) {
        const log = {
          id: `al-${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          timestamp: new Date()
        };
        mockStore.activityLogs.push(log);
        return log;
      }
      return prisma.activityLog.create({ data });
    }
  }
};

// Helper: recalculate employee compliance and risk score when tasks update
function recalculateScores(employeeId: string) {
  const empTasks = mockStore.tasks.filter(t => t.employeeId === employeeId);
  const employee = mockStore.employees.find(e => e.id === employeeId);
  if (!employee || empTasks.length === 0) return;

  const completed = empTasks.filter(t => t.status === "COMPLETED").length;
  const compliance = Math.round((completed / empTasks.length) * 100);
  
  // High risk if compliance is low, and also DevOps/Sales roles have different base risk weights
  let baseRisk = 50;
  if (employee.department === "Engineering") baseRisk = 70;
  if (employee.department === "Sales") baseRisk = 30;

  const risk = Math.max(5, Math.min(95, Math.round(baseRisk * (1 - (compliance / 100)))));
  
  employee.complianceScore = compliance;
  employee.riskScore = risk;
  
  if (compliance === 100) {
    employee.status = "ACTIVE";
  } else {
    employee.status = "ONBOARDING";
  }
}
