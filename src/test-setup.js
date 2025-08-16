import '@testing-library/jest-dom';

// Mock window.alert
global.alert = vi.fn();

// Mock window.open
global.open = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;