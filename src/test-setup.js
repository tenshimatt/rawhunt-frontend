import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../../tests/mocks/server.js';

// Start MSW server before all tests
beforeAll(() => {
  server.listen();
  console.log('🚀 MSW server started for frontend tests');
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  // Clear localStorage after each test
  global.localStorage.clear();
  // Clear all mocks
  vi.clearAllMocks();
});

// Stop MSW server after all tests
afterAll(() => {
  server.close();
  console.log('🛑 MSW server stopped');
});

// Mock window.alert
global.alert = vi.fn();

// Mock window.open
global.open = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key) => {
    const storage = localStorageMock.__storage || {};
    return storage[key] || null;
  }),
  setItem: vi.fn((key, value) => {
    localStorageMock.__storage = localStorageMock.__storage || {};
    localStorageMock.__storage[key] = value;
  }),
  removeItem: vi.fn((key) => {
    if (localStorageMock.__storage) {
      delete localStorageMock.__storage[key];
    }
  }),
  clear: vi.fn(() => {
    localStorageMock.__storage = {};
  }),
  __storage: {}
};
global.localStorage = localStorageMock;

// Mock sessionStorage
global.sessionStorage = {
  ...localStorageMock,
  __storage: {}
};

// Mock the API services module directly (fallback for non-MSW tests)
vi.mock('./services/api.js');

// Mock fetch globally (MSW will handle this, but fallback for edge cases)
global.fetch = vi.fn();

// Mock geolocation API
global.navigator.geolocation = {
  getCurrentPosition: vi.fn((success) => {
    setTimeout(() => success({
      coords: {
        latitude: 41.8781,
        longitude: -87.6298,
        accuracy: 100
      }
    }), 100);
  }),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

// Mock intersection observer
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock resize observer
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo for smooth scrolling tests
global.scrollTo = vi.fn();

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