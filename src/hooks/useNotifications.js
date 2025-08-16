import { useState, useCallback, useEffect } from 'react';
import { notificationsAPI, apiUtils } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasMore: false,
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);

      const response = await notificationsAPI.getAll(page, limit);
      
      if (page === 1) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      }

      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalResults: response.data.pagination.totalResults,
        hasMore: response.data.pagination.hasMore,
      });

      return response.data;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to fetch notifications:', error);
      return { notifications: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.count);
      return response.data.count;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      return 0;
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      return { success: true };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      console.error('Failed to mark notification as read:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      await notificationsAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );

      setUnreadCount(0);

      return { success: true };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more notifications (pagination)
  const loadMoreNotifications = useCallback(async () => {
    if (!pagination.hasMore || loading) return;
    
    await fetchNotifications(pagination.currentPage + 1);
  }, [pagination.currentPage, pagination.hasMore, loading, fetchNotifications]);

  // Get notification type display info
  const getNotificationTypeInfo = useCallback((type) => {
    const typeMap = {
      order_status: {
        label: 'Order Update',
        icon: '📦',
        color: 'text-blue-600',
      },
      paws_earned: {
        label: 'PAWS Earned',
        icon: '🐾',
        color: 'text-amber-600',
      },
      paws_transfer: {
        label: 'PAWS Transfer',
        icon: '💰',
        color: 'text-green-600',
      },
      review_reminder: {
        label: 'Review Reminder',
        icon: '⭐',
        color: 'text-purple-600',
      },
      supplier_update: {
        label: 'Supplier Update',
        icon: '🏪',
        color: 'text-orange-600',
      },
      system: {
        label: 'System',
        icon: '🔔',
        color: 'text-gray-600',
      },
    };

    return typeMap[type] || {
      label: 'Notification',
      icon: '📢',
      color: 'text-gray-600',
    };
  }, []);

  // Filter notifications by type
  const filterNotificationsByType = useCallback((type) => {
    if (!type || type === 'all') {
      return notifications;
    }
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Filter unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.is_read);
  }, [notifications]);

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  // Periodic check for new notifications (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  const clearError = () => setError(null);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      hasMore: false,
    });
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    loadMoreNotifications,
    getNotificationTypeInfo,
    filterNotificationsByType,
    getUnreadNotifications,
    clearError,
    clearNotifications,
  };
};