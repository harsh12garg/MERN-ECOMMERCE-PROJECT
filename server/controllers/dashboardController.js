import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total counts
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments({ isActive: true });
  const totalOrders = await Order.countDocuments();

  // Calculate total revenue
  const revenueData = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  // Get sales data for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlySales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        sales: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Format monthly sales data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesData = monthlySales.map((item) => ({
    name: monthNames[item._id.month - 1],
    sales: Math.round(item.sales),
    orders: item.orders,
  }));

  // Get category-wise product distribution
  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: '$categoryInfo.name',
        value: { $sum: 1 },
      },
    },
    { $sort: { value: -1 } },
    { $limit: 5 },
  ]);

  const categoryData = categoryStats.map((item) => ({
    name: item._id,
    value: item.value,
  }));

  // Get recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Calculate trends (compare with previous period)
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const lastMonthOrders = await Order.countDocuments({
    createdAt: { $gte: lastMonth },
  });
  
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 2);
  
  const previousMonthOrders = await Order.countDocuments({
    createdAt: { $gte: previousMonth, $lt: lastMonth },
  });

  const orderTrend = previousMonthOrders > 0
    ? (((lastMonthOrders - previousMonthOrders) / previousMonthOrders) * 100).toFixed(1)
    : 0;

  res.json({
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      orderTrend,
    },
    salesData,
    categoryData,
    recentOrders,
  });
});

// @desc    Get sales analytics
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = '7days' } = req.query;

  let startDate = new Date();
  switch (period) {
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
  }

  const analytics = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(analytics);
});

// @desc    Get top selling products
// @route   GET /api/dashboard/top-products
// @access  Private/Admin
export const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({ isActive: true })
    .sort({ soldCount: -1 })
    .limit(10)
    .populate('category', 'name');

  res.json(topProducts);
});

// @desc    Get low stock products
// @route   GET /api/dashboard/low-stock
// @access  Private/Admin
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const lowStockProducts = await Product.find({
    isActive: true,
    stock: { $lte: 10, $gt: 0 },
  })
    .sort({ stock: 1 })
    .limit(10)
    .populate('category', 'name');

  res.json(lowStockProducts);
});
