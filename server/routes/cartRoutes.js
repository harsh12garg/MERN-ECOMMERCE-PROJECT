import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  mergeCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

// Public/Private routes (works for both guest and logged-in users)
router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addToCart);
router.put('/items/:itemId', optionalAuth, updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeFromCart);
router.delete('/', optionalAuth, clearCart);
router.post('/coupon', optionalAuth, applyCoupon);

// Private routes
router.post('/merge', protect, mergeCart);

export default router;
