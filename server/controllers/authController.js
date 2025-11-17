import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Session from '../models/Session.js';
import PasswordReset from '../models/PasswordReset.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setTokenCookies,
  clearTokenCookies,
  generateOTP,
  hashToken,
} from '../utils/tokenUtils.js';
import { parseDeviceInfo } from '../utils/deviceParser.js';
import { sendOTPEmail, sendPasswordResetConfirmation, sendLoginAlert } from '../utils/emailService.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Parse device info
    const deviceInfo = parseDeviceInfo(req.headers['user-agent'], req.ip);

    // Create session
    await Session.create({
      user: user._id,
      refreshToken: hashToken(refreshToken),
      deviceInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if account is locked
  if (user.isLocked) {
    res.status(423);
    throw new Error('Account is locked due to too many failed login attempts. Please try again later.');
  }

  // Check if account is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is deactivated');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    await user.incLoginAttempts();
    
    // Log failed login
    const { logLoginFailed } = await import('../utils/securityLogger.js');
    await logLoginFailed(email, req);
    
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Parse device info
  const deviceInfo = parseDeviceInfo(req.headers['user-agent'], req.ip);

  // Create session
  await Session.create({
    user: user._id,
    refreshToken: hashToken(refreshToken),
    deviceInfo,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Log security event
  const { logLoginSuccess } = await import('../utils/securityLogger.js');
  await logLoginSuccess(user._id, req);

  // Send login alert (optional)
  await sendLoginAlert(user.email, user.name, deviceInfo);

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.cookies;

  if (!token) {
    res.status(401);
    throw new Error('No refresh token provided');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(token);

  if (!decoded) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }

  // Check if session exists
  const session = await Session.findOne({
    user: decoded.id,
    refreshToken: hashToken(token),
    isActive: true,
  });

  if (!session) {
    res.status(401);
    throw new Error('Session not found or expired');
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(decoded.id);
  const newRefreshToken = generateRefreshToken(decoded.id);

  // Update session with new refresh token
  session.refreshToken = hashToken(newRefreshToken);
  session.lastActivity = Date.now();
  await session.save();

  // Set new cookies
  setTokenCookies(res, newAccessToken, newRefreshToken);

  res.json({
    success: true,
    accessToken: newAccessToken,
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    // Deactivate session
    await Session.updateOne(
      { refreshToken: hashToken(refreshToken) },
      { isActive: false }
    );
  }

  // Clear cookies
  clearTokenCookies(res);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
export const logoutAll = asyncHandler(async (req, res) => {
  // Deactivate all user sessions
  await Session.updateMany(
    { user: req.user._id, isActive: true },
    { isActive: false }
  );

  // Clear cookies
  clearTokenCookies(res);

  res.json({
    success: true,
    message: 'Logged out from all devices',
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
    },
  });
});

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate OTP
  const otp = generateOTP();

  // Delete any existing password reset requests
  await PasswordReset.deleteMany({ user: user._id });

  // Create new password reset request
  await PasswordReset.create({
    user: user._id,
    otp: hashToken(otp),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // Send OTP via email
  await sendOTPEmail(user.email, otp, user.name);

  res.json({
    success: true,
    message: 'OTP sent to your email',
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Find password reset request
  const resetRequest = await PasswordReset.findOne({
    user: user._id,
    isUsed: false,
    expiresAt: { $gt: Date.now() },
  });

  if (!resetRequest) {
    res.status(400);
    throw new Error('OTP expired or invalid');
  }

  // Check attempts
  if (resetRequest.attempts >= 3) {
    await resetRequest.deleteOne();
    res.status(429);
    throw new Error('Too many attempts. Please request a new OTP');
  }

  // Verify OTP
  const isValid = resetRequest.otp === hashToken(otp);

  if (!isValid) {
    resetRequest.attempts += 1;
    await resetRequest.save();
    res.status(400);
    throw new Error('Invalid OTP');
  }

  res.json({
    success: true,
    message: 'OTP verified successfully',
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Find and verify password reset request
  const resetRequest = await PasswordReset.findOne({
    user: user._id,
    otp: hashToken(otp),
    isUsed: false,
    expiresAt: { $gt: Date.now() },
  });

  if (!resetRequest) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Mark OTP as used
  resetRequest.isUsed = true;
  await resetRequest.save();

  // Deactivate all sessions
  await Session.updateMany({ user: user._id }, { isActive: false });

  // Send confirmation email
  await sendPasswordResetConfirmation(user.email, user.name);

  res.json({
    success: true,
    message: 'Password reset successfully',
  });
});

// @desc    Get active sessions
// @route   GET /api/auth/sessions
// @access  Private
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({
    user: req.user._id,
    isActive: true,
  }).sort({ lastActivity: -1 });

  res.json({
    success: true,
    sessions: sessions.map((session) => ({
      _id: session._id,
      deviceInfo: session.deviceInfo,
      lastActivity: session.lastActivity,
      createdAt: session.createdAt,
    })),
  });
});

// @desc    Revoke specific session
// @route   DELETE /api/auth/sessions/:id
// @access  Private
export const revokeSession = asyncHandler(async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  session.isActive = false;
  await session.save();

  res.json({
    success: true,
    message: 'Session revoked successfully',
  });
});
