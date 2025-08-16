// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'rawgle_token',
  TOKEN_EXPIRY_KEY: 'rawgle_token_expiry',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  ORDERS_PAGE_SIZE: 10,
  REVIEWS_PAGE_SIZE: 10,
  NOTIFICATIONS_PAGE_SIZE: 20,
};

// PAWS System
export const PAWS_CONFIG = {
  WELCOME_BONUS: 100,
  REVIEW_REWARD: 50,
  ORDER_PERCENTAGE: 0.1, // 10%
  TRANSFER_MIN_AMOUNT: 10,
  TRANSFER_MAX_AMOUNT: 10000,
  DAILY_EARN_LIMIT: 1000,
};

// Supplier Categories
export const SUPPLIER_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🍖' },
  { id: 'beef', name: 'Raw Beef', icon: '🥩' },
  { id: 'chicken', name: 'Raw Chicken', icon: '🍗' },
  { id: 'fish', name: 'Raw Fish', icon: '🐟' },
  { id: 'freeze-dried', name: 'Freeze-Dried', icon: '❄️' },
  { id: 'organic', name: 'Organic', icon: '🌿' },
  { id: 'supplements', name: 'Supplements', icon: '💊' },
  { id: 'treats', name: 'Treats', icon: '🦴' },
  { id: 'bones', name: 'Raw Bones', icon: '🦴' },
  { id: 'organs', name: 'Organ Meat', icon: '🫀' },
];

// Order Status
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_DISPLAY = {
  [ORDER_STATUSES.PENDING]: {
    label: 'Pending',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: '⏳',
    description: 'Order is being reviewed'
  },
  [ORDER_STATUSES.CONFIRMED]: {
    label: 'Confirmed',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: '✅',
    description: 'Order has been confirmed'
  },
  [ORDER_STATUSES.PREPARING]: {
    label: 'Preparing',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: '👨‍🍳',
    description: 'Your order is being prepared'
  },
  [ORDER_STATUSES.READY]: {
    label: 'Ready for Pickup',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    icon: '📦',
    description: 'Order is ready for pickup'
  },
  [ORDER_STATUSES.DELIVERING]: {
    label: 'Out for Delivery',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    icon: '🚚',
    description: 'Order is on its way'
  },
  [ORDER_STATUSES.COMPLETED]: {
    label: 'Completed',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: '🎉',
    description: 'Order has been completed'
  },
  [ORDER_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: '❌',
    description: 'Order has been cancelled'
  },
};

// Review Ratings
export const REVIEW_RATINGS = {
  1: { label: 'Poor', emoji: '😞', color: 'text-red-500' },
  2: { label: 'Fair', emoji: '😐', color: 'text-orange-500' },
  3: { label: 'Good', emoji: '🙂', color: 'text-yellow-500' },
  4: { label: 'Very Good', emoji: '😊', color: 'text-lime-500' },
  5: { label: 'Excellent', emoji: '🤩', color: 'text-green-500' },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER_STATUS: 'order_status',
  PAWS_EARNED: 'paws_earned',
  PAWS_TRANSFER: 'paws_transfer',
  REVIEW_REMINDER: 'review_reminder',
  SUPPLIER_UPDATE: 'supplier_update',
  SYSTEM: 'system',
};

export const NOTIFICATION_TYPE_DISPLAY = {
  [NOTIFICATION_TYPES.ORDER_STATUS]: {
    label: 'Order Update',
    icon: '📦',
    color: 'text-blue-600',
  },
  [NOTIFICATION_TYPES.PAWS_EARNED]: {
    label: 'PAWS Earned',
    icon: '🐾',
    color: 'text-amber-600',
  },
  [NOTIFICATION_TYPES.PAWS_TRANSFER]: {
    label: 'PAWS Transfer',
    icon: '💰',
    color: 'text-green-600',
  },
  [NOTIFICATION_TYPES.REVIEW_REMINDER]: {
    label: 'Review Reminder',
    icon: '⭐',
    color: 'text-purple-600',
  },
  [NOTIFICATION_TYPES.SUPPLIER_UPDATE]: {
    label: 'Supplier Update',
    icon: '🏪',
    color: 'text-orange-600',
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    label: 'System',
    icon: '🔔',
    color: 'text-gray-600',
  },
};

// Sort Options
export const SORT_OPTIONS = {
  RECOMMENDED: 'recommended',
  DISTANCE: 'distance',
  RATING: 'rating',
  PRICE_LOW: 'price_low',
  PRICE_HIGH: 'price_high',
  PAWS_REWARDS: 'paws_rewards',
  NEWEST: 'newest',
  OLDEST: 'oldest',
};

export const SORT_DISPLAY = {
  [SORT_OPTIONS.RECOMMENDED]: 'Recommended',
  [SORT_OPTIONS.DISTANCE]: 'Distance: Nearest',
  [SORT_OPTIONS.RATING]: 'Rating: Highest',
  [SORT_OPTIONS.PRICE_LOW]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_HIGH]: 'Price: High to Low',
  [SORT_OPTIONS.PAWS_REWARDS]: 'PAWS Rewards: Highest',
  [SORT_OPTIONS.NEWEST]: 'Newest First',
  [SORT_OPTIONS.OLDEST]: 'Oldest First',
};

// Filter Options
export const PRICE_RANGES = [
  { id: 'budget', label: '$ · Budget-friendly', min: 0, max: 30 },
  { id: 'mid', label: '$$ · Mid-range', min: 30, max: 60 },
  { id: 'premium', label: '$$$ · Premium', min: 60, max: 100 },
  { id: 'luxury', label: '$$$$ · Luxury', min: 100, max: null },
];

export const DISTANCE_OPTIONS = [
  { id: '5', label: 'Within 5 miles', value: 5 },
  { id: '10', label: 'Within 10 miles', value: 10 },
  { id: '25', label: 'Within 25 miles', value: 25 },
  { id: '50', label: 'Within 50 miles', value: 50 },
];

export const SERVICE_FILTERS = [
  { id: 'delivery', label: 'Home Delivery' },
  { id: 'subscription', label: 'Subscription Plans' },
  { id: 'consultation', label: 'Nutritional Consultation' },
  { id: 'custom_plans', label: 'Custom Meal Plans' },
  { id: 'bulk_orders', label: 'Bulk Orders' },
  { id: 'organic', label: 'Organic Options' },
  { id: 'local', label: 'Locally Sourced' },
];

export const CERTIFICATION_FILTERS = [
  { id: 'usda_organic', label: 'USDA Organic' },
  { id: 'grass_fed', label: 'Grass-Fed' },
  { id: 'human_grade', label: 'Human-Grade' },
  { id: 'aafco', label: 'AAFCO Certified' },
  { id: 'non_gmo', label: 'Non-GMO' },
  { id: 'hormone_free', label: 'Hormone-Free' },
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! You have been logged in successfully.',
  REGISTER_SUCCESS: 'Account created successfully! Welcome to Rawgle!',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  PROFILE_UPDATED: 'Your profile has been updated successfully.',
  PASSWORD_CHANGED: 'Your password has been changed successfully.',
  REVIEW_SUBMITTED: 'Thank you for your review! You have earned PAWS rewards.',
  ORDER_PLACED: 'Your order has been placed successfully!',
  PAWS_TRANSFERRED: 'PAWS transferred successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rawgle_token',
  USER_PREFERENCES: 'rawgle_user_preferences',
  SEARCH_HISTORY: 'rawgle_search_history',
  RECENT_SUPPLIERS: 'rawgle_recent_suppliers',
  CART_ITEMS: 'rawgle_cart_items',
};

// Feature Flags
export const FEATURES = {
  GEOLOCATION: true,
  PUSH_NOTIFICATIONS: true,
  DARK_MODE: false,
  SOCIAL_SHARING: true,
  REFERRAL_PROGRAM: false,
  LOYALTY_TIERS: false,
};

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAILS: '/suppliers/:id',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  REVIEWS: '/reviews',
  PAWS_WALLET: '/paws',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  HELP: '/help',
  PRIVACY: '/privacy',
  TERMS: '/terms',
};