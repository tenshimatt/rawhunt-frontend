import { vi } from 'vitest';

// Test data for mocking
export const mockSuppliersData = {
  success: true,
  data: {
    suppliers: [
      {
        id: 1,
        name: 'Chicago Premium Pet Foods',
        category: 'Pet Food',
        location_latitude: 41.8781,
        location_longitude: -87.6298,
        location_address: '123 Michigan Ave, Chicago, IL 60601',
        rating_average: 4.8,
        rating_count: 156,
        distance: 0.5,
        price_range: 'high',
        description: 'Premium raw dog food supplier in downtown Chicago',
        contact_phone: '+1-312-555-0123',
        website_url: 'https://chicagopremiumpets.com',
        is_verified: true
      },
      {
        id: 2,
        name: 'Windy City Raw Foods',
        category: 'Pet Food', 
        location_latitude: 41.8858,
        location_longitude: -87.6229,
        location_address: '456 State St, Chicago, IL 60654',
        rating_average: 4.6,
        rating_count: 89,
        distance: 1.2,
        price_range: 'medium',
        description: 'Chicago-based raw food specialists for dogs',
        contact_phone: '+1-312-555-0456',
        website_url: 'https://windycityraw.com',
        is_verified: true
      },
      {
        id: 3,
        name: 'NYC Pet Supplies',
        category: 'Pet Food',
        location_latitude: 40.7128,
        location_longitude: -74.0060,
        location_address: '789 Broadway, New York, NY 10003',
        rating_average: 4.2,
        rating_count: 45,
        distance: 2.1,
        price_range: 'medium',
        description: 'Pet store in New York',
        contact_phone: '+1-212-555-0789',
        website_url: 'https://nycpetsupplies.com',
        is_verified: false
      }
    ],
    pagination: {
      total: 3,
      page: 1,
      limit: 20
    }
  }
};

export const mockChicagoSearchData = {
  success: true,
  data: {
    suppliers: [
      {
        id: 1,
        name: 'Chicago Premium Pet Foods',
        category: 'Pet Food',
        location_latitude: 41.8781,
        location_longitude: -87.6298,
        location_address: '123 Michigan Ave, Chicago, IL 60601',
        rating_average: 4.8,
        rating_count: 156,
        distance: 0.5,
        price_range: 'high',
        description: 'Premium raw dog food supplier in downtown Chicago',
        contact_phone: '+1-312-555-0123',
        website_url: 'https://chicagopremiumpets.com',
        is_verified: true
      },
      {
        id: 2,
        name: 'Windy City Raw Foods',
        category: 'Pet Food',
        location_latitude: 41.8858,
        location_longitude: -87.6229,
        location_address: '456 State St, Chicago, IL 60654',
        rating_average: 4.6,
        rating_count: 89,
        distance: 1.2,
        price_range: 'medium',
        description: 'Chicago-based raw food specialists for dogs',
        contact_phone: '+1-312-555-0456',
        website_url: 'https://windycityraw.com',
        is_verified: true
      }
    ],
    pagination: {
      total: 2,
      page: 1,
      limit: 20
    }
  }
};

export const mockEmptySearchData = {
  success: true,
  data: {
    suppliers: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 20
    }
  }
};

// Mock implementations for all API functions
export const suppliersAPI = {
  search: vi.fn().mockResolvedValue(mockSuppliersData),
  getById: vi.fn().mockResolvedValue({
    success: true,
    data: {
      supplier: {
        id: 1,
        name: 'Test Supplier',
        category: 'Pet Food'
      }
    }
  }),
  getCategories: vi.fn().mockResolvedValue({
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
  }),
  getNearby: vi.fn().mockResolvedValue({
    success: true,
    data: {
      suppliers: []
    }
  })
};

export const authAPI = {
  register: vi.fn().mockResolvedValue({ success: true }),
  login: vi.fn().mockResolvedValue({ success: true }),
  logout: vi.fn().mockResolvedValue({ success: true }),
  getCurrentUser: vi.fn().mockResolvedValue({ success: true }),
  updateProfile: vi.fn().mockResolvedValue({ success: true }),
  changePassword: vi.fn().mockResolvedValue({ success: true })
};

export const pawsAPI = {
  getBalance: vi.fn().mockResolvedValue({ success: true, data: { balance: 1250 } }),
  getTransactions: vi.fn().mockResolvedValue({ success: true, data: { transactions: [] } }),
  transfer: vi.fn().mockResolvedValue({ success: true }),
  earnReward: vi.fn().mockResolvedValue({ success: true }),
  getRewardRates: vi.fn().mockResolvedValue({ success: true, data: { rates: {} } })
};

export const reviewsAPI = {
  getBySupplier: vi.fn().mockResolvedValue({ success: true, data: { reviews: [] } }),
  create: vi.fn().mockResolvedValue({ success: true }),
  update: vi.fn().mockResolvedValue({ success: true }),
  delete: vi.fn().mockResolvedValue({ success: true }),
  getUserReviews: vi.fn().mockResolvedValue({ success: true, data: { reviews: [] } })
};

export const ordersAPI = {
  create: vi.fn().mockResolvedValue({ success: true }),
  getById: vi.fn().mockResolvedValue({ success: true }),
  getUserOrders: vi.fn().mockResolvedValue({ success: true, data: { orders: [] } }),
  updateStatus: vi.fn().mockResolvedValue({ success: true }),
  cancel: vi.fn().mockResolvedValue({ success: true })
};

export const notificationsAPI = {
  getAll: vi.fn().mockResolvedValue({ success: true, data: { notifications: [] } }),
  markAsRead: vi.fn().mockResolvedValue({ success: true }),
  markAllAsRead: vi.fn().mockResolvedValue({ success: true }),
  getUnreadCount: vi.fn().mockResolvedValue({ success: true, data: { count: 0 } })
};

export const apiUtils = {
  handleError: vi.fn(),
  formatResponse: vi.fn(),
  isAuthenticated: vi.fn().mockReturnValue(false),
  getAuthToken: vi.fn(),
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn()
};

// Mock default export
const api = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
};

export default api;