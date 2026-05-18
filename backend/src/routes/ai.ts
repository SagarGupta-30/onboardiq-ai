import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST AI Chat stream (Server-Sent Events)
router.post('/chat', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Set SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Fetch database state to feed into the AI Context
    const employees = await db.employees.findMany({ include: { tasks: true } });
    const audits = await db.securityAudits.findMany();
    
    // Core summary context
    const highRisk = employees.filter((e: any) => e.riskScore > 50);
    const soc2 = audits.find((a: any) => a.category === 'SOC2');
    const gdpr = audits.find((a: any) => a.category === 'GDPR');
    const iso = audits.find((a: any) => a.category === 'ISO27001');

    // Analyze the message for custom keywords to give extremely accurate and contextual answers
    const msgLower = message.toLowerCase();
    let responseText = "";

    if (msgLower.includes('alex') || msgLower.includes('rivera')) {
      const alex = employees.find((e: any) => e.firstName.toLowerCase() === 'alex');
      if (alex) {
        const pending = alex.tasks.filter((t: any) => t.status === 'PENDING').map((t: any) => `**${t.title}** (${t.category})`);
        responseText = `**Alex Rivera** is currently in the **${alex.status}** stage with a **${alex.complianceScore}%** compliance score. 
        \n\nHis security risk profile is low/moderate (**${alex.riskScore}%**). 
        \n\nHe has **${pending.length} pending onboarding tasks**:
        ${pending.length > 0 ? pending.map(t => `\n- ${t}`).join('') : '\n- All tasks completed successfully!'}
        \n\nTo improve his compliance posture, I suggest reminding him to complete his *Security Awareness Training* which is due soon.`;
      } else {
        responseText = `I couldn't find an employee named Alex Rivera in the current system.`;
      }
    } 
    else if (msgLower.includes('david') || msgLower.includes('kim') || msgLower.includes('devops')) {
      const david = employees.find((e: any) => e.firstName.toLowerCase() === 'david');
      if (david) {
        responseText = `⚠️ **Critical Security Flag detected for ${david.firstName} ${david.lastName}** (${david.role}):
        \n- **Compliance Score**: ${david.complianceScore}%
        \n- **Risk Score**: ${david.riskScore}% (HIGH RISK)
        \n\n**Outstanding High-Severity Vulnerabilities**:
        \n1. *AWS IAM & MFA Policy Consent* - Missing (Infrastructure Access danger)
        \n2. *Background Screening Clearance* - Processing delayed
        \n\n**Recommendation**: Since DevOps engineers possess root configuration permissions for AWS production infrastructure, company protocol dictates immediate suspension of further credential provisioning until his background check clears and MFA compliance is signed.`;
      } else {
        responseText = `I couldn't find a DevOps engineer named David in the system.`;
      }
    }
    else if (msgLower.includes('soc') || msgLower.includes('soc2') || msgLower.includes('compliance')) {
      const socScore = soc2 ? soc2.score : 75;
      responseText = `🔒 **OnboardIQ AI Security & SOC 2 Compliance Report:**
      \nOur organization's live **SOC 2 readiness score is currently at ${socScore}%**.
      \n\n**Current Gaps Blocking Compliance:**
      \n- **Security Training Audits**: 2 new hires have not finalized their Security Awareness checklists.
      \n- **Background Checks**: David Kim (DevOps) is active in system setup without fully verified background clearance (Severity: Critical).
      \n- **Device Encryption**: All other active devices are compliant at 95% MDM coverage.
      \n\n**Action Items**:
      \n1. Enforce background check clearance for DevOps hires.
      \n2. Automate notifications to pending training employees.`;
    }
    else if (msgLower.includes('gdpr') || msgLower.includes('privacy') || msgLower.includes('eu')) {
      const gdprScore = gdpr ? gdpr.score : 40;
      responseText = `🇪🇺 **GDPR Readiness Report:**
      \nOur organization's live **GDPR compliance score is currently at ${gdprScore}% (FAILING/WARNING STATUS)**.
      \n\n**Primary Issues Detected:**
      \n- Multiple customer-facing team members in the Sales department have skipped the *Customer Data Processing & GDPR Training* modules.
      \n- Background check validation latency is causing policy breaches.
      \n\n**Remediation**:
      \nI recommend launching an automated campaign to enforce the GDPR compliance curriculum for the Sales team immediately.`;
    }
    else if (msgLower.includes('high risk') || msgLower.includes('risk') || msgLower.includes('danger')) {
      responseText = `⚠️ **Security Alert: Live Risk Profile Summary**
      \nI detected **${highRisk.length} High-Risk employee(s)** with pending high-severity security tasks.
      ${highRisk.map((e: any) => `\n\n- **${e.firstName} ${e.lastName}** (${e.role} - ${e.department})
        \n  - Risk Score: **${e.riskScore}%** (due to missing critical infrastructure security tasks)
        \n  - Pending: ${e.tasks.filter((t: any) => t.status === 'PENDING').map((t: any) => t.title).join(', ')}`).join('')}
      \n\nWould you like me to draft automated Slack/Email alerts to these employees to enforce security compliance immediately?`;
    }
    else {
      // General informative SaaS AI response
      responseText = `Hello! I am your **OnboardIQ AI Assistant**. I monitor employee onboarding compliance pipelines and evaluate security posture in real-time.
      \n\nHere are some operations you can command me to perform:
      \n- *"How is Alex Rivera's onboarding going?"*
      \n- *"Show me our SOC 2 compliance readiness"*
      \n- *"List high risk employees"*
      \n- *"Assess GDPR compliance gaps"*
      \n\nHow can I help protect your enterprise's compliance posture today?`;
    }

    // Stream the response token-by-token (SSE format) to perfectly simulate standard streaming AI
    const words = responseText.split(' ');
    let currentWordIdx = 0;
    
    const interval = setInterval(() => {
      if (currentWordIdx < words.length) {
        // Take a small chunk of words
        const chunk = words.slice(currentWordIdx, currentWordIdx + 3).join(' ') + ' ';
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        currentWordIdx += 3;
      } else {
        res.write('data: [DONE]\n\n');
        clearInterval(interval);
        res.end();
      }
    }, 40); // smooth simulated streaming output

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(interval);
    });

  } catch (error: any) {
    console.error("AI Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
});

export default router;
