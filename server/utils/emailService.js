import nodemailer from 'nodemailer';
import {
  welcomeEmail,
  orderConfirmationEmail,
  orderShippedEmail,
  passwordChangedEmail,
  lowStockAlertEmail,
  newOrderAdminEmail,
} from './emailTemplates.js';

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production' && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return null;
};

// Generic email sender
const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`
      ========================================
      EMAIL (Development Mode)
      To: ${to}
      Subject: ${subject}
      ========================================
    `);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'E-Shop <noreply@eshop.com>',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Send OTP Email
export const sendOTPEmail = async (email, otp, name) => {
  const subject = 'Password Reset OTP - E-Shop';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .otp { font-size: 32px; font-weight: bold; color: #1976d2; text-align: center; padding: 20px; background: white; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>You requested to reset your password. Use the OTP code below:</p>
          <div class="otp">${otp}</div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, subject, html);
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const { subject, html } = welcomeEmail(name);
  return await sendEmail(email, subject, html);
};

// Send Order Confirmation
export const sendOrderConfirmation = async (order, user) => {
  const { subject, html } = orderConfirmationEmail(order, user);
  return await sendEmail(user.email, subject, html);
};

// Send Order Shipped Notification
export const sendOrderShipped = async (order, user, trackingNumber) => {
  const { subject, html } = orderShippedEmail(order, user, trackingNumber);
  return await sendEmail(user.email, subject, html);
};

// Send Password Changed Notification
export const sendPasswordChanged = async (email, name) => {
  const { subject, html } = passwordChangedEmail(name);
  return await sendEmail(email, subject, html);
};

// Send Low Stock Alert to Admin
export const sendLowStockAlert = async (product, currentStock) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return false;

  const { subject, html } = lowStockAlertEmail(product, currentStock);
  return await sendEmail(adminEmail, subject, html);
};

// Send New Order Alert to Admin
export const sendNewOrderAlert = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return false;

  const { subject, html } = newOrderAdminEmail(order);
  return await sendEmail(adminEmail, subject, html);
};

// Send Password Reset Confirmation
export const sendPasswordResetConfirmation = async (email, name) => {
  return await sendPasswordChanged(email, name);
};

// Send Login Alert
export const sendLoginAlert = async (email, name, deviceInfo) => {
  const subject = 'New Login to Your Account';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .device-info { background: white; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 New Login Detected</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We detected a new login to your account.</p>
          <div class="device-info">
            <p><strong>Device:</strong> ${deviceInfo.device}</p>
            <p><strong>Browser:</strong> ${deviceInfo.browser}</p>
            <p><strong>OS:</strong> ${deviceInfo.os}</p>
            <p><strong>IP Address:</strong> ${deviceInfo.ip}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>If this wasn't you, please secure your account immediately.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, subject, html);
};

export default {
  sendOTPEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendOrderShipped,
  sendPasswordChanged,
  sendLowStockAlert,
  sendNewOrderAlert,
  sendPasswordResetConfirmation,
  sendLoginAlert,
};
