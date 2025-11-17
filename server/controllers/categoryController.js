import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { deleteImage } from '../config/cloudinary.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  // If admin is requesting, show all categories including inactive ones
  const isAdmin = req.user && req.user.role === 'admin';
  const filter = isAdmin ? {} : { isActive: true };
  
  const categories = await Category.find(filter).sort({ order: 1 });
  
  // Calculate product count for each category dynamically
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const productCount = await Product.countDocuments({ 
        category: category._id,
        isActive: true 
      });
      const categoryObj = category.toObject();
      categoryObj.productCount = productCount;
      return categoryObj;
    })
  );
  
  res.json(categoriesWithCount);
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json(category);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, subcategories, icon, order } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    description,
    image,
    subcategories,
    icon,
    order,
  });

  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  Object.keys(req.body).forEach((key) => {
    category[key] = req.body[key];
  });

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ category: category._id });

  if (productCount > 0) {
    res.status(400);
    throw new Error('Cannot delete category with existing products');
  }

  // Delete image from Cloudinary
  if (category.image && category.image.publicId) {
    await deleteImage(category.image.publicId);
  }

  await category.deleteOne();
  res.json({ message: 'Category removed' });
});

// @desc    Add subcategory
// @route   POST /api/categories/:id/subcategories
// @access  Private/Admin
export const addSubcategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, description, image } = req.body;

  category.subcategories.push({ name, description, image });
  await category.save();

  res.status(201).json(category);
});

// @desc    Update subcategory
// @route   PUT /api/categories/:id/subcategories/:subId
// @access  Private/Admin
export const updateSubcategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const subcategory = category.subcategories.id(req.params.subId);

  if (!subcategory) {
    res.status(404);
    throw new Error('Subcategory not found');
  }

  Object.keys(req.body).forEach((key) => {
    subcategory[key] = req.body[key];
  });

  await category.save();
  res.json(category);
});

// @desc    Delete subcategory
// @route   DELETE /api/categories/:id/subcategories/:subId
// @access  Private/Admin
export const deleteSubcategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category.subcategories.pull(req.params.subId);
  await category.save();

  res.json({ message: 'Subcategory removed' });
});

// @desc    Update product count for all categories
// @route   PUT /api/categories/update-counts
// @access  Private/Admin
export const updateProductCounts = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  for (const category of categories) {
    const count = await Product.countDocuments({ category: category._id });
    category.productCount = count;
    await category.save();
  }

  res.json({ message: 'Product counts updated' });
});
