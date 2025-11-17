import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  updateProductCounts,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

// Public routes (with optional auth to show all categories to admin)
router.get('/', optionalAuth, getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);
router.put('/update-counts', protect, admin, updateProductCounts);

// Subcategory routes
router.post('/:id/subcategories', protect, admin, addSubcategory);
router.put('/:id/subcategories/:subId', protect, admin, updateSubcategory);
router.delete('/:id/subcategories/:subId', protect, admin, deleteSubcategory);

export default router;
