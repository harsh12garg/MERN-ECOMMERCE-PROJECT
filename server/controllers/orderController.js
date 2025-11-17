import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { createPaymentIntent, verifyPayment } from '../config/payment.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Verify stock availability
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.product.name}`);
    }
  }

  // Create order items
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price,
    image: item.product.images[0]?.url,
    variant: item.variant,
  }));

  // Apply coupon if exists
  let discount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode });
    if (coupon && coupon.isValid()) {
      discount = coupon.calculateDiscount(cart.subtotal);
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal: cart.subtotal,
    discount,
    couponCode: cart.couponCode,
    shippingCharge: cart.shippingCharge,
    total: cart.total,
  });

  // Update product stock and check for low stock
  for (const item of cart.items) {
    const product = await Product.findByIdAndUpdate(
      item.product._id,
      {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      },
      { new: true }
    );

    // Check for low stock and send alert
    if (product.stock <= 5 && product.stock > 0) {
      const { sendLowStockAlert } = await import('../utils/emailService.js');
      await sendLowStockAlert(product, product.stock);

      // Notify admin
      const { notifyLowStock } = await import('../utils/notificationService.js');
      const User = (await import('../models/User.js')).default;
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await notifyLowStock(admin._id, product.name, product._id, product.stock);
      }
    }
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  // Send notifications and emails
  const { sendOrderConfirmation, sendNewOrderAlert } = await import('../utils/emailService.js');
  const { notifyOrderPlaced } = await import('../utils/notificationService.js');
  const { logOrderPlaced } = await import('../utils/securityLogger.js');

  await sendOrderConfirmation(order, req.user);
  await sendNewOrderAlert(order);
  await notifyOrderPlaced(req.user._id, order.orderNumber, order._id);
  await logOrderPlaced(req.user._id, order.orderNumber, order.total, req);

  res.status(201).json(order);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name images');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if user owns the order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;

  const query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  const count = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify payment
  const isValid = await verifyPayment(req.body);

  if (!isValid) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    updateTime: req.body.update_time,
    emailAddress: req.body.email_address,
  };

  const updatedOrder = await order.save();

  // Log payment success
  const { logPaymentSuccess } = await import('../utils/securityLogger.js');
  const { notifyPaymentSuccess } = await import('../utils/notificationService.js');
  
  await logPaymentSuccess(order.user, order.orderNumber, order.total, order.paymentMethod, req);
  await notifyPaymentSuccess(order.user, order.total, order._id);

  res.json(updatedOrder);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, notes } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status || order.status;
  order.trackingNumber = trackingNumber || order.trackingNumber;
  order.notes = notes || order.notes;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  // Send shipment notification if status is shipped
  if (status === 'shipped' && trackingNumber) {
    const { sendOrderShipped } = await import('../utils/emailService.js');
    const { notifyOrderShipped } = await import('../utils/notificationService.js');
    const User = (await import('../models/User.js')).default;
    
    const user = await User.findById(order.user);
    if (user) {
      await sendOrderShipped(order, user, trackingNumber);
      await notifyOrderShipped(user._id, order.orderNumber, order._id, trackingNumber);
    }
  }

  res.json(updatedOrder);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.status === 'delivered' || order.status === 'shipped') {
    res.status(400);
    throw new Error('Cannot cancel shipped or delivered orders');
  }

  order.status = 'cancelled';

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Create payment intent
// @route   POST /api/orders/:id/payment-intent
// @access  Private
export const createOrderPaymentIntent = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const paymentIntent = await createPaymentIntent(order);
  res.json(paymentIntent);
});

// @desc    Generate invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private
export const generateOrderInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if user owns the order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this invoice');
  }

  const { generateInvoice } = await import('../utils/invoiceGenerator.js');
  const pdfBuffer = await generateInvoice(order, req.user);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
  res.send(pdfBuffer);
});
