// Application constants

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User roles
export const USER_ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
};

// Event statuses
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// Route paths
export const ROUTES = {
  // Public routes
  HOME: '/',
  EVENTS: '/events',
  GALLERY: '/gallery',
  MARKETPLACE: '/marketplace',
  HOW_IT_WORKS: '/how-it-works',
  
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Merchant routes (formerly vendor)
  MERCHANT_DASHBOARD: '/merchant/dashboard',
  MERCHANT_SERVICES: '/merchant/services',
  MERCHANT_BOOKINGS: '/merchant/bookings',
  
  // Organizer routes
  ORGANIZER_DASHBOARD: '/organizer/dashboard',
  ORGANIZER_EVENTS: '/organizer/events',
  ORGANIZER_CREATE_EVENT: '/organizer/events/create',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_SETTINGS: '/admin/settings',
};
