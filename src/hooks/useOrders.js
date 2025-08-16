import { useState, useCallback } from 'react';
import { ordersAPI, apiUtils } from '../services/api';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasMore: false,
  });

  // Fetch user's orders
  const fetchUserOrders = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.getUserOrders(page, limit);
      
      if (page === 1) {
        setOrders(response.data.orders);
      } else {
        setOrders(prev => [...prev, ...response.data.orders]);
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
      console.error('Failed to fetch user orders:', error);
      return { orders: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new order
  const createOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.create(orderData);
      
      // Add the new order to the beginning of the list
      setOrders(prev => [response.data.order, ...prev]);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, status, notes) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.updateStatus(orderId, status, notes);
      
      // Update the order in the list
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, ...response.data.order } : order
        )
      );

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel an order
  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.cancel(orderId, reason);
      
      // Update the order status in the list
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled', cancellation_reason: reason }
            : order
        )
      );

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more orders (pagination)
  const loadMoreOrders = useCallback(async () => {
    if (!pagination.hasMore || loading) return;
    
    await fetchUserOrders(pagination.currentPage + 1);
  }, [pagination.currentPage, pagination.hasMore, loading, fetchUserOrders]);

  // Get order status display info
  const getOrderStatusInfo = useCallback((status) => {
    const statusMap = {
      pending: { 
        label: 'Pending', 
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: '⏳'
      },
      confirmed: { 
        label: 'Confirmed', 
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: '✅'
      },
      preparing: { 
        label: 'Preparing', 
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: '👨‍🍳'
      },
      ready: { 
        label: 'Ready for Pickup', 
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        icon: '📦'
      },
      delivering: { 
        label: 'Out for Delivery', 
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        icon: '🚚'
      },
      completed: { 
        label: 'Completed', 
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: '🎉'
      },
      cancelled: { 
        label: 'Cancelled', 
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: '❌'
      },
    };

    return statusMap[status] || {
      label: status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown',
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      icon: '❓'
    };
  }, []);

  // Filter orders by status
  const filterOrdersByStatus = useCallback((status) => {
    if (!status || status === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === status);
  }, [orders]);

  const clearError = () => setError(null);

  const clearOrders = () => {
    setOrders([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      hasMore: false,
    });
  };

  return {
    orders,
    loading,
    error,
    pagination,
    fetchUserOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    loadMoreOrders,
    getOrderStatusInfo,
    filterOrdersByStatus,
    clearError,
    clearOrders,
  };
};

// Hook for order details
export const useOrderDetails = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.getById(id);
      setOrder(response.data.order);
      
      return response.data.order;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to fetch order details:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return {
    order,
    loading,
    error,
    fetchOrder,
    clearError,
  };
};