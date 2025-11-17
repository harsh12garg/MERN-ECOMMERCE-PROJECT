import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login_success',
        'login_failed',
        'logout',
        'password_change',
        'password_reset',
        'account_locked',
        'account_unlocked',
        'payment_attempt',
        'payment_success',
        'payment_failed',
        'order_placed',
        'order_cancelled',
        'suspicious_activity',
      ],
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'warning', 'error'],
      default: 'success',
    },
    details: {
      type: String,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
securityLogSchema.index({ user: 1, action: 1, createdAt: -1 });
securityLogSchema.index({ ipAddress: 1, createdAt: -1 });
securityLogSchema.index({ severity: 1, createdAt: -1 });

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

export default SecurityLog;
