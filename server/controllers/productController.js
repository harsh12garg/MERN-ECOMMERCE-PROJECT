import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { deleteImage } from '../config/cloudinary.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  // Build query
  const query = { isActive: true };

  // Search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Category filter
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Subcategory filter
  if (req.query.subcategory) {
    query.subcategory = req.query.subcategory;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Rating filter
  if (req.query.rating) {
    query.rating = { $gte: Number(req.query.rating) };
  }

  // Brand filter
  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  // Tags filter
  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(',') };
  }

  // Featured filter
  if (req.query.featured === 'true') {
    query.featured = true;
  }

  // Sort options
  let sortOption = { createdAt: -1 };
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'popular':
        sortOption = { soldCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .select('-reviews')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(sortOption);

  // Convert products to objects with virtuals
  const productsWithVirtuals = products.map(product => product.toObject({ virtuals: true }));

  res.json({
    products: productsWithVirtuals,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  })
    .populate('category', 'name slug')
    .populate('reviews.user', 'name avatar');

  if (product) {
    // Convert to object and include virtuals
    const productObj = product.toObject({ virtuals: true });
    res.json(productObj);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    name: req.body.name || 'Sample Product',
    description: req.body.description || 'Sample description',
    price: req.body.price || 0,
    category: req.body.category,
    brand: req.body.brand || '',
    stock: req.body.stock || 0,
    images: req.body.images || [],
  });

  // Update category product count
  if (product.category) {
    const category = await Category.findById(product.category);
    if (category) {
      category.productCount = await Product.countDocuments({ 
        category: product.category,
        isActive: true 
      });
      await category.save();
    }
  }

  const productObj = product.toObject({ virtuals: true });
  res.status(201).json(productObj);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const oldCategory = product.category;
  const newCategory = req.body.category;

  // Update fields
  Object.keys(req.body).forEach((key) => {
    product[key] = req.body[key];
  });

  const updatedProduct = await product.save();

  // Update category product counts if category changed
  if (oldCategory && newCategory && oldCategory.toString() !== newCategory.toString()) {
    // Update old category count
    const oldCat = await Category.findById(oldCategory);
    if (oldCat) {
      oldCat.productCount = await Product.countDocuments({ 
        category: oldCategory,
        isActive: true 
      });
      await oldCat.save();
    }
    
    // Update new category count
    const newCat = await Category.findById(newCategory);
    if (newCat) {
      newCat.productCount = await Product.countDocuments({ 
        category: newCategory,
        isActive: true 
      });
      await newCat.save();
    }
  } else if (newCategory) {
    // Just update the current category count
    const category = await Category.findById(newCategory);
    if (category) {
      category.productCount = await Product.countDocuments({ 
        category: newCategory,
        isActive: true 
      });
      await category.save();
    }
  }

  const productObj = updatedProduct.toObject({ virtuals: true });
  res.json(productObj);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const categoryId = product.category;

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      if (image.publicId) {
        await deleteImage(image.publicId);
      }
    }
  }

  await product.deleteOne();

  // Update category product count
  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (category) {
      category.productCount = await Product.countDocuments({ 
        category: categoryId,
        isActive: true 
      });
      await category.save();
    }
  }

  res.json({ message: 'Product removed' });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'reviews.user',
    'name avatar'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product.reviews);
});

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/Admin
export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
    alt: req.body.alt || product.name,
  }));

  product.images.push(...images);
  await product.save();

  res.json({ message: 'Images uploaded', images });
});

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const image = product.images.id(req.params.imageId);

  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }

  // Delete from Cloudinary
  if (image.publicId) {
    await deleteImage(image.publicId);
  }

  product.images.pull(req.params.imageId);
  await product.save();

  res.json({ message: 'Image deleted' });
});

// @desc    Get product filters data
// @route   GET /api/products/filters/data
// @access  Public
export const getFiltersData = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).select('name slug');
  
  const brands = await Product.distinct('brand');
  const tags = await Product.distinct('tags');
  
  const priceRange = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.json({
    categories,
    brands: brands.filter(Boolean),
    tags: tags.filter(Boolean),
    priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
  });
});
