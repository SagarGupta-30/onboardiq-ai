import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seed...");

  // Clear existing data
  await prisma.onboardingTask.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.securityAudit.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users (HR and Security Officers)
  const hashedPassword = await bcrypt.hash('password', 10);
  const hrUser = await prisma.user.create({
    data: {
      email: 'admin@onboardiq.ai',
      name: 'Sarah Jenkins',
      password: hashedPassword,
      role: 'HR'
    }
  });

  const securityUser = await prisma.user.create({
    data: {
      email: 'security@onboardiq.ai',
      name: 'Marcus Vance',
      password: hashedPassword,
      role: 'SECURITY_OFFICER'
    }
  });

  console.log(`Created users: ${hrUser.email}, ${securityUser.email}`);

  // 2. Create Employees
  const alex = await prisma.employee.create({
    data: {
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@onboardiq-client.com',
      department: 'Engineering',
      role: 'Frontend Engineer',
      status: 'ONBOARDING',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      riskScore: 35,
      complianceScore: 60,
      userId: hrUser.id
    }
  });

  const sophia = await prisma.employee.create({
    data: {
      firstName: 'Sophia',
      lastName: 'Chen',
      email: 'sophia.chen@onboardiq-client.com',
      department: 'Product',
      role: 'Product Manager',
      status: 'ONBOARDING',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      riskScore: 12,
      complianceScore: 80
    }
  });

  const jordan = await prisma.employee.create({
    data: {
      firstName: 'Jordan',
      lastName: 'Smith',
      email: 'jordan.smith@onboardiq-client.com',
      department: 'Sales',
      role: 'Enterprise Account Executive',
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      riskScore: 8,
      complianceScore: 100
    }
  });

  console.log(`Created employees: ${alex.firstName}, ${sophia.firstName}, ${jordan.firstName}`);

  // 3. Create Tasks
  await prisma.onboardingTask.createMany({
    data: [
      {
        employeeId: alex.id,
        title: 'Sign NDA & Code of Conduct',
        description: 'Review and sign the company confidentiality agreements and code of conduct document.',
        category: 'DOCUMENT',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        completedAt: new Date()
      },
      {
        employeeId: alex.id,
        title: 'Complete Security Awareness Training',
        description: 'Complete the initial 45-minute baseline security awareness course and pass the assessment quiz.',
        category: 'TRAINING',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        employeeId: alex.id,
        title: 'Provision MDM & Laptop Setup',
        description: 'Install corporate mobile device management agent and set up hard drive encryption (FileVault).',
        category: 'IT_SETUP',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      },
      {
        employeeId: sophia.id,
        title: 'Sign NDA & Code of Conduct',
        description: 'Review and sign the company confidentiality agreements and code of conduct document.',
        category: 'DOCUMENT',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        completedAt: new Date()
      },
      {
        employeeId: sophia.id,
        title: 'Verify Background Check',
        description: 'Submit documentation for compliance verification via background check portal.',
        category: 'SECURITY',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        completedAt: new Date()
      },
      {
        employeeId: sophia.id,
        title: 'Configure 2FA on Password Manager',
        description: 'Complete setup for corporate 1Password account and enforce multi-factor authentication.',
        category: 'SECURITY',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ]
  });

  // 4. Create Security Audits
  await prisma.securityAudit.createMany({
    data: [
      {
        category: 'SOC2',
        title: 'Employee Background Checks',
        description: 'Verify that all onboarding personnel have completed identity and criminal history audits prior to system provisioning.',
        status: 'WARNING',
        score: 75
      },
      {
        category: 'ISO27001',
        title: 'Access Control & Enforced MFA',
        description: 'Confirm that all active employee accounts have configured and actively use multi-factor authentication.',
        status: 'PASSED',
        score: 100
      },
      {
        category: 'GDPR',
        title: 'Data Processing Training',
        description: 'Ensure that staff dealing with customer personal data have finished GDPR compliance training modules.',
        status: 'FAILED',
        score: 40
      }
    ]
  });

  // 5. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: hrUser.id,
        userName: hrUser.name,
        action: 'EMPLOYEE_CREATE',
        details: 'Initiated onboarding sequence for Alex Rivera (Frontend Engineer).',
        severity: 'INFO',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000)
      },
      {
        userId: securityUser.id,
        userName: securityUser.name,
        action: 'TASK_COMPLETE',
        details: "Marked Sophia Chen's task 'Verify Background Check' as completed.",
        severity: 'INFO',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  });

  console.log("🌱 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
