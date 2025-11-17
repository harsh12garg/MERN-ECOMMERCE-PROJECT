import asyncHandler from 'express-async-handler';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from '../utils/notificationService.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const unreadOnly = req.query.unreadOnly === 'true';

  const notifications = await getUserNotifications(req.user._id, limit, unreadOnly);
  const unreadCount = await getUnreadCount(req.user._id);
  
  res.json({
    notifications,
    unreadCount,
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const success = await markAsRead(req.params.id);

  if (success) {
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(400);
    throw new Error('Failed to mark notification as read');
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const success = await markAllAsRead(req.user._id);

  if (success) {
    res.json({ message: 'All notifications marked as read' });
  } else {
    res.status(400);
    throw new Error('Failed to mark all notifications as read');
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const removeNotification = asyncHandler(async (req, res) => {
  const success = await deleteNotification(req.params.id);

  if (success) {
    res.json({ message: 'Notification deleted' });
  } else {
    res.status(400);
    throw new Error('Failed to delete notification');
  }
});

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const count = await getUnreadCount(req.user._id);
  res.json({ count });
});
