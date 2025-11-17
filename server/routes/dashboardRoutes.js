import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics,
  getTopProducts,
  getLowStockProducts,
} from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/analytics', protect, admin, getSalesAnalytics);
router.get('/top-products', protect, admin, getTopProducts);
router.get('/low-stock', protect, admin, getLowStockProducts);

export default router;
