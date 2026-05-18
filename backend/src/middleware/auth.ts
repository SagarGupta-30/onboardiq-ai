import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ArmorIQ } from '../utils/armorIQ';

const JWT_SECRET = process.env.JWT_SECRET || 'onboardiq_super_secret_jwt_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // 1. Detect Suspicious Activity via ArmorIQ Heuristic Engine
  const suspiciousCheck = ArmorIQ.detectSuspiciousActivity(
    { body: req.body, query: req.query },
    req.path
  );

  if (suspiciousCheck.isSuspicious) {
    // Log Critical Violation to Auditing Stream
    ArmorIQ.logAudit(
      'Anonymous / External API Client',
      null,
      'SUSPICIOUS_ACTIVITY_DETECTED',
      suspiciousCheck.reason || 'Suspicious payload detected.',
      'CRITICAL'
    );

    return res.status(400).json({ 
      error: 'Security Violation: Suspicious activity signature detected and blocked by ArmorIQ SDK.',
      details: suspiciousCheck.reason
    });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Policy Enforcement using ArmorIQ SDK
    const policyCheck = ArmorIQ.enforcePolicy(req.user.role, req.method);
    if (!policyCheck.allowed) {
      ArmorIQ.logAudit(
        req.user.name,
        req.user.id,
        'POLICY_VIOLATION_BLOCKED',
        policyCheck.reason || 'Unauthorized access attempt.',
        'WARNING'
      );

      return res.status(403).json({ 
        error: 'Access Denied by ArmorIQ Policy Enforcement Engine', 
        reason: policyCheck.reason 
      });
    }

    if (!roles.includes(req.user.role)) {
      ArmorIQ.logAudit(
        req.user.name,
        req.user.id,
        'ROLE_CHECK_FAILED',
        `User lacks required role filters: Required [${roles.join(', ')}], Current: "${req.user.role}".`,
        'WARNING'
      );
      
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    next();
  };
}
