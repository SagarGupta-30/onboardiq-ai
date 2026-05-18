import { db } from '../db';

export class ArmorIQ {
  /**
   * 1. Policy Enforcement Gatekeeper
   * Validates if a specific security role has sufficient authority to execute the action.
   */
  static enforcePolicy(userRole: string, action: string): { allowed: boolean; reason: string | null } {
    const role = userRole.toUpperCase();
    const act = action.toUpperCase();

    // Sensitive Admin Operations
    if (act.includes('DELETE') || act.includes('PROVISION') || act.includes('MUTATE')) {
      if (role !== 'ADMIN' && role !== 'SECURITY_OFFICER') {
        return {
          allowed: false,
          reason: `Policy Violation: Role "${role}" lacks authority to mutate infrastructure or directories via action "${act}".`
        };
      }
    }

    // Default Allow
    return { allowed: true, reason: null };
  }

  /**
   * 2. Secure Audit Logger
   * Writes high-fidelity security events directly to the database and standard out.
   */
  static async logAudit(
    userName: string, 
    userId: string | null, 
    action: string, 
    details: string, 
    severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO'
  ): Promise<void> {
    console.log(`[ArmorIQ AuditLog] [${severity}] Action: ${action} | User: ${userName} | Details: ${details}`);
    
    try {
      // Direct commit to our unified db repository layer
      await db.activityLogs.push({
        id: `audit-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        userName,
        action,
        details,
        severity,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('[ArmorIQ Audit Error] Failed to write event to repository logs:', err);
    }
  }

  /**
   * 3. Suspicious Heuristics Detector
   * Evaluates inbound requests to block injections, malicious patterns, or privilege escalations.
   */
  static detectSuspiciousActivity(payload: any, path: string): { isSuspicious: boolean; reason: string | null } {
    const payloadStr = JSON.stringify(payload || {}).toLowerCase();
    
    // Pattern checks
    const sqlInjectionPatterns = [
      "select * from", 
      "union select", 
      "drop table", 
      "or 1=1", 
      "--"
    ];

    const privilegeEscalationKeywords = [
      "role: 'admin'",
      "role: \"admin\"",
      "\"role\":\"admin\"",
      "privileges: 100"
    ];

    // Evaluate SQL Injection attempts
    for (const pat of sqlInjectionPatterns) {
      if (payloadStr.includes(pat)) {
        return {
          isSuspicious: true,
          reason: `Suspicious SQL Injection signature identified matching keyword pattern: "${pat}" on route "${path}".`
        };
      }
    }

    // Evaluate Role Manipulation attempts
    for (const kw of privilegeEscalationKeywords) {
      if (payloadStr.includes(kw)) {
        return {
          isSuspicious: true,
          reason: `Unauthorized privilege escalation request attempting to inject high-privilege credentials on route "${path}".`
        };
      }
    }

    return { isSuspicious: false, reason: null };
  }

  /**
   * 4. Secure Onboarding Workflow Validator
   * Ensures high-privilege positions (DevOps, SecOps) cannot bypass key checklist checkpoints.
   */
  static validateWorkflow(employee: any): { isValid: boolean; failures: string[] } {
    const failures: string[] = [];
    const roleLower = (employee.role || '').toLowerCase();
    const tasks = employee.tasks || [];

    // Rule 1: High Privilege cloud controllers require background clearance
    if (roleLower.includes('devops') || roleLower.includes('security') || roleLower.includes('infrastructure')) {
      const backgroundTask = tasks.find((t: any) => 
        (t.title || '').toLowerCase().includes('background') || 
        (t.description || '').toLowerCase().includes('screening')
      );

      if (backgroundTask && backgroundTask.status !== 'COMPLETED') {
        failures.push("DevOps/Security roles require fully cleared Background Screenings before cloud console configurations can be finalized.");
      }
    }

    // Rule 2: Least privilege AWS IAM policies require hardware MFA setup
    if (roleLower.includes('devops') || roleLower.includes('engineer')) {
      const mfaTask = tasks.find((t: any) => 
        (t.title || '').toLowerCase().includes('mfa') || 
        (t.title || '').toLowerCase().includes('2fa')
      );

      if (mfaTask && mfaTask.status !== 'COMPLETED') {
        failures.push("Engineering personnel must setup physical Multi-Factor Authentication keys (MFA) to satisfy directory rules.");
      }
    }

    return {
      isValid: failures.length === 0,
      failures
    };
  }
}
