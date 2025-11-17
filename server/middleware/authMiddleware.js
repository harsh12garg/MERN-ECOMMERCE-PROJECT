import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { verifyAccessToken, hashToken } from '../utils/tokenUtils.js';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies
  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Check for token in Authorization header
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded || decoded.type !== 'access') {
      res.status(401);
      throw new Error('Invalid token');
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (!req.user.isActive) {
      res.status(401);
      throw new Error('User account is deactivated');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

// Verify refresh token middleware
export const verifyRefresh = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401);
    throw new Error('No refresh token provided');
  }

  // Check if session exists
  const session = await Session.findOne({
    refreshToken: hashToken(refreshToken),
    isActive: true,
  });

  if (!session) {
    res.status(401);
    throw new Error('Invalid or expired session');
  }

  req.session = session;
  next();
});
