import Notification from '../models/Notification.js';

// Create notification
export const createNotification = async (userId, type, title, message, link = null, priority = 'medium', metadata = {}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
      priority,
      metadata,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};

// Create order notification
export const notifyOrderPlaced = async (userId, orderNumber, orderId) => {
  return await createNotification(
    userId,
    'order',
    'Order Placed Successfully',
    `Your order #${orderNumber} has been placed successfully.`,
    `/orders/${orderId}`,
    'high'
  );
};

// Create shipment notification
export const notifyOrderShipped = async (userId, orderNumber, orderId, trackingNumber) => {
  return await createNotification(
    userId,
    'shipment',
    'Order Shipped',
    `Your order #${orderNumber} has been shipped. Tracking: ${trackingNumber}`,
    `/orders/${orderId}`,
    'high',
    { trackingNumber }
  );
};

// Create payment notification
export const notifyPaymentSuccess = async (userId, amount, orderId) => {
  return await createNotification(
    userId,
    'payment',
    'Payment Successful',
    `Your payment of $${amount.toFixed(2)} has been processed successfully.`,
    `/orders/${orderId}`,
    'medium'
  );
};

// Create low stock notification for admin
export const notifyLowStock = async (adminId, productName, productId, currentStock) => {
  return await createNotification(
    adminId,
    'product',
    'Low Stock Alert',
    `${productName} is running low on stock (${currentStock} remaining).`,
    `/admin/products`,
    'urgent',
    { productId, currentStock }
  );
};

// Create security notification
export const notifySecurityAlert = async (userId, action, details) => {
  return await createNotification(
    userId,
    'security',
    'Security Alert',
    details,
    '/settings/security',
    'high',
    { action }
  );
};

// Get user notifications
export const getUserNotifications = async (userId, limit = 20, unreadOnly = false) => {
  try {
    const query = { user: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return notifications;
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
    return true;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    await Notification.findByIdAndDelete(notificationId);
    return true;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return false;
  }
};

// Get unread count
export const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });
    return count;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
};

export default {
  createNotification,
  notifyOrderPlaced,
  notifyOrderShipped,
  notifyPaymentSuccess,
  notifyLowStock,
  notifySecurityAlert,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
