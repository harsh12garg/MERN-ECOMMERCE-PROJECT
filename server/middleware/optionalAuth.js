import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

// Optional authentication - doesn't fail if no token
export const optionalAuth = asyncHandler(async (req, res, next) => {
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

  if (token) {
    try {
      // Verify token
      const decoded = verifyAccessToken(token);

      if (decoded && decoded.type === 'access') {
        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (error) {
      // Token invalid, but continue without user
      req.user = null;
    }
  }

  next();
});
