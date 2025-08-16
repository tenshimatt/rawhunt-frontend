import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rawgle-backend.findrawdogfood.workers.dev';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => localStorage.getItem('rawgle_token');
const setToken = (token) => localStorage.setItem('rawgle_token', token);
const removeToken = () => localStorage.removeItem('rawgle_token');

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it and redirect to login
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    // Transform frontend data to match backend expectations
    const backendData = {
      email: userData.email,
      password: userData.password,
      name: `${userData.firstName} ${userData.lastName}`.trim(),
      phone: userData.phoneNumber || undefined
    };
    
    const response = await api.post('/auth/register', backendData);
    
    // Handle different response structures
    if (response.data.token) {
      setToken(response.data.token);
      return { data: response.data };
    } else if (response.data.data?.token) {
      setToken(response.data.data.token);
      return response.data;
    }
    
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // Handle different response structures
    if (response.data.token) {
      setToken(response.data.token);
      return { data: response.data };
    } else if (response.data.data?.token) {
      setToken(response.data.data.token);
      return response.data;
    }
    
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      removeToken();
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },
};

// Suppliers API (Updated to match working backend endpoints)
export const suppliersAPI = {
  search: async (params = {}) => {
    // Convert our frontend params to working backend format
    const backendParams = {
      q: params.search || params.query || '',
      limit: params.limit || 20,
      offset: params.offset || 0
    };
    const response = await api.get('/search', { params: backendParams });
    return {
      success: true,
      data: {
        suppliers: response.data.results || [],
        pagination: {
          total: response.data.total || 0,
          page: Math.floor((response.data.offset || 0) / (response.data.limit || 20)) + 1,
          limit: response.data.limit || 20
        }
      }
    };
  },

  getById: async (id) => {
    // Use supplier endpoint with id parameter
    const response = await api.get('/supplier', { params: { id } });
    return {
      success: true,
      data: { supplier: response.data.supplier }
    };
  },

  getCategories: async () => {
    // For now, return static categories since working backend doesn't have this endpoint
    return {
      success: true,
      data: {
        categories: [
          { id: 1, name: 'Pet Grooming', icon: 'scissors' },
          { id: 2, name: 'Veterinary', icon: 'medical' },
          { id: 3, name: 'Pet Training', icon: 'graduation-cap' },
          { id: 4, name: 'Pet Sitting', icon: 'home' },
          { id: 5, name: 'Pet Walking', icon: 'walk' },
          { id: 6, name: 'Pet Food', icon: 'shopping-cart' },
          { id: 7, name: 'Pet Supplies', icon: 'gift' },
          { id: 8, name: 'Emergency Care', icon: 'ambulance' }
        ]
      }
    };
  },

  getNearby: async (latitude, longitude, radius = 25) => {
    const response = await api.get('/nearby', {
      params: { lat: latitude, lng: longitude, radius },
    });
    return {
      success: true,
      data: {
        suppliers: response.data.results || []
      }
    };
  },
};

// PAWS API
export const pawsAPI = {
  getBalance: async () => {
    const response = await api.get('/paws/balance');
    return response.data;
  },

  getTransactions: async (page = 1, limit = 20) => {
    const response = await api.get('/paws/transactions', {
      params: { page, limit },
    });
    return response.data;
  },

  transfer: async (recipientId, amount, description) => {
    const response = await api.post('/paws/transfer', {
      recipientId,
      amount,
      description,
    });
    return response.data;
  },

  earnReward: async (type, referenceId, amount) => {
    const response = await api.post('/paws/earn', {
      type,
      referenceId,
      amount,
    });
    return response.data;
  },

  getRewardRates: async () => {
    const response = await api.get('/paws/reward-rates');
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getBySupplier: async (supplierId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/supplier/${supplierId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  update: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  delete: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  getUserReviews: async (page = 1, limit = 10) => {
    const response = await api.get('/reviews/user', {
      params: { page, limit },
    });
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async (page = 1, limit = 10) => {
    const response = await api.get('/orders/user', {
      params: { page, limit },
    });
    return response.data;
  },

  updateStatus: async (orderId, status, notes) => {
    const response = await api.put(`/orders/${orderId}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  cancel: async (orderId, reason) => {
    const response = await api.post(`/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (page = 1, limit = 20) => {
    const response = await api.get('/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Format API response data
  formatResponse: (response) => {
    return response.data || response;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  },

  // Get current token
  getAuthToken: getToken,
  
  // Set auth token
  setAuthToken: setToken,
  
  // Remove auth token
  clearAuthToken: removeToken,
};

// Export the configured axios instance for custom requests
export default api;