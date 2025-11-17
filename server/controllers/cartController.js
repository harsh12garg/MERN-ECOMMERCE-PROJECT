import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private/Public
export const getCart = asyncHandler(async (req, res) => {
  // Generate a session ID from IP and user agent if not logged in
  const sessionId = req.user 
    ? null 
    : `guest_${req.ip}_${Buffer.from(req.headers['user-agent'] || 'unknown').toString('base64').substring(0, 20)}`;
  
  const query = req.user ? { user: req.user._id } : { sessionId };

  let cart = await Cart.findOne(query).populate('items.product', 'name price images stock');

  if (!cart) {
    cart = await Cart.create({
      ...(req.user ? { user: req.user._id } : { sessionId }),
      items: [],
    });
  }

  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private/Public
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  const sessionId = req.user 
    ? null 
    : `guest_${req.ip}_${Buffer.from(req.headers['user-agent'] || 'unknown').toString('base64').substring(0, 20)}`;
  
  const query = req.user ? { user: req.user._id } : { sessionId };
  let cart = await Cart.findOne(query);

  if (!cart) {
    cart = await Cart.create({
      ...(req.user ? { user: req.user._id } : { sessionId }),
      items: [],
    });
  }

  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
      variant,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.json(cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private/Public
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const sessionId = req.user 
    ? null 
    : `guest_${req.ip}_${Buffer.from(req.headers['user-agent'] || 'unknown').toString('base64').substring(0, 20)}`;
  
  const query = req.user ? { user: req.user._id } : { sessionId };
  const cart = await Cart.findOne(query);

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Check stock
  const product = await Product.findById(item.product);
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private/Public
export const removeFromCart = asyncHandler(async (req, res) => {
  const sessionId = req.user 
    ? null 
    : `guest_${req.ip}_${Buffer.from(req.headers['user-agent'] || 'unknown').toString('base64').substring(0, 20)}`;
  
  const query = req.user ? { user: req.user._id } : { sessionId };
  const cart = await Cart.findOne(query);

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items.pull(req.params.itemId);
  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.json(cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private/Public
export const clearCart = asyncHandler(async (req, res) => {
  const sessionId = req.user 
    ? null 
    : `guest_${req.ip}_${Buffer.from(req.headers['user-agent'] || 'unknown').toString('base64').substring(0, 20)}`;
  
  const query = req.user ? { user: req.user._id } : { sessionId };
  const cart = await Cart.findOne(query);

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = [];
  await cart.save();

  res.json({ message: 'Cart cleared' });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private/Public
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const sessionId = req.user 
    ? null 
    : `guest_${req.ip}_${Buffer.from(req.headers['user-agent'] || 'unknown').toString('base64').substring(0, 20)}`;
  
  const query = req.user ? { user: req.user._id } : { sessionId };
  const cart = await Cart.findOne(query);

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const Coupon = (await import('../models/Coupon.js')).default;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.isValid()) {
    res.status(400);
    throw new Error('Invalid or expired coupon');
  }

  const discount = coupon.calculateDiscount(cart.subtotal);

  if (discount === 0) {
    res.status(400);
    throw new Error(`Minimum purchase of $${coupon.minPurchase} required`);
  }

  cart.couponCode = code.toUpperCase();
  cart.discount = discount;
  await cart.save();

  res.json(cart);
});

// @desc    Merge guest cart with user cart
// @route   POST /api/cart/merge
// @access  Private
export const mergeCart = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  const guestCart = await Cart.findOne({ sessionId });
  const userCart = await Cart.findOne({ user: req.user._id });

  if (!guestCart || guestCart.items.length === 0) {
    return res.json(userCart || { items: [] });
  }

  if (!userCart) {
    guestCart.user = req.user._id;
    guestCart.sessionId = undefined;
    await guestCart.save();
    return res.json(guestCart);
  }

  // Merge items
  for (const guestItem of guestCart.items) {
    const existingItemIndex = userCart.items.findIndex(
      (item) =>
        item.product.toString() === guestItem.product.toString() &&
        JSON.stringify(item.variant) === JSON.stringify(guestItem.variant)
    );

    if (existingItemIndex > -1) {
      userCart.items[existingItemIndex].quantity += guestItem.quantity;
    } else {
      userCart.items.push(guestItem);
    }
  }

  await userCart.save();
  await guestCart.deleteOne();

  await userCart.populate('items.product', 'name price images stock');
  res.json(userCart);
});
