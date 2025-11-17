import SecurityLog from '../models/SecurityLog.js';
import { parseDeviceInfo } from './deviceParser.js';

// Log security event
export const logSecurityEvent = async (
  userId,
  action,
  ipAddress,
  userAgent,
  status = 'success',
  details = '',
  metadata = {},
  severity = 'low'
) => {
  try {
    const deviceInfo = parseDeviceInfo(userAgent, ipAddress);

    await SecurityLog.create({
      user: userId,
      action,
      ipAddress,
      userAgent,
      deviceInfo,
      status,
      details,
      metadata,
      severity,
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Log successful login
export const logLoginSuccess = async (userId, req) => {
  await logSecurityEvent(
    userId,
    'login_success',
    req.ip,
    req.headers['user-agent'],
    'success',
    'User logged in successfully',
    {},
    'low'
  );
};

// Log failed login
export const logLoginFailed = async (email, req, reason = 'Invalid credentials') => {
  await logSecurityEvent(
    null,
    'login_failed',
    req.ip,
    req.headers['user-agent'],
    'failed',
    `Failed login attempt for ${email}: ${reason}`,
    { email },
    'medium'
  );
};

// Log account locked
export const logAccountLocked = async (userId, req) => {
  await logSecurityEvent(
    userId,
    'account_locked',
    req.ip,
    req.headers['user-agent'],
    'warning',
    'Account locked due to multiple failed login attempts',
    {},
    'high'
  );
};

// Log password change
export const logPasswordChange = async (userId, req) => {
  await logSecurityEvent(
    userId,
    'password_change',
    req.ip,
    req.headers['user-agent'],
    'success',
    'Password changed successfully',
    {},
    'medium'
  );
};

// Log password reset
export const logPasswordReset = async (userId, req) => {
  await logSecurityEvent(
    userId,
    'password_reset',
    req.ip,
    req.headers['user-agent'],
    'success',
    'Password reset successfully',
    {},
    'medium'
  );
};

// Log payment attempt
export const logPaymentAttempt = async (userId, orderId, amount, req) => {
  await logSecurityEvent(
    userId,
    'payment_attempt',
    req.ip,
    req.headers['user-agent'],
    'success',
    `Payment attempt for order ${orderId}`,
    { orderId, amount },
    'medium'
  );
};

// Log payment success
export const logPaymentSuccess = async (userId, orderId, amount, paymentMethod, req) => {
  await logSecurityEvent(
    userId,
    'payment_success',
    req.ip,
    req.headers['user-agent'],
    'success',
    `Payment successful for order ${orderId}`,
    { orderId, amount, paymentMethod },
    'low'
  );
};

// Log payment failed
export const logPaymentFailed = async (userId, orderId, amount, reason, req) => {
  await logSecurityEvent(
    userId,
    'payment_failed',
    req.ip,
    req.headers['user-agent'],
    'failed',
    `Payment failed for order ${orderId}: ${reason}`,
    { orderId, amount, reason },
    'high'
  );
};

// Log order placed
export const logOrderPlaced = async (userId, orderId, total, req) => {
  await logSecurityEvent(
    userId,
    'order_placed',
    req.ip,
    req.headers['user-agent'],
    'success',
    `Order ${orderId} placed successfully`,
    { orderId, total },
    'low'
  );
};

// Log order cancelled
export const logOrderCancelled = async (userId, orderId, reason, req) => {
  await logSecurityEvent(
    userId,
    'order_cancelled',
    req.ip,
    req.headers['user-agent'],
    'success',
    `Order ${orderId} cancelled: ${reason}`,
    { orderId, reason },
    'medium'
  );
};

// Log suspicious activity
export const logSuspiciousActivity = async (userId, details, req) => {
  await logSecurityEvent(
    userId,
    'suspicious_activity',
    req.ip,
    req.headers['user-agent'],
    'warning',
    details,
    {},
    'critical'
  );
};

// Get security logs for user
export const getUserSecurityLogs = async (userId, limit = 50) => {
  try {
    const logs = await SecurityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return logs;
  } catch (error) {
    console.error('Failed to get security logs:', error);
    return [];
  }
};

// Get recent security alerts
export const getRecentAlerts = async (severity = 'high', limit = 20) => {
  try {
    const logs = await SecurityLog.find({
      severity: { $in: [severity, 'critical'] },
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    return logs;
  } catch (error) {
    console.error('Failed to get security alerts:', error);
    return [];
  }
};

export default {
  logSecurityEvent,
  logLoginSuccess,
  logLoginFailed,
  logAccountLocked,
  logPasswordChange,
  logPasswordReset,
  logPaymentAttempt,
  logPaymentSuccess,
  logPaymentFailed,
  logOrderPlaced,
  logOrderCancelled,
  logSuspiciousActivity,
  getUserSecurityLogs,
  getRecentAlerts,
};
