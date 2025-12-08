export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  ORGANIZER: "organizer",
  VENDOR: "vendor",
};

// Pagination constants
export const PAGINATION = {
  // Default limits
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  
  // Event-specific pagination
  EVENTS_DEFAULT_LIMIT: 20,
  EVENTS_MAX_LIMIT: 50,
  EVENTS_MIN_LIMIT: 5,
  
  // User-specific pagination
  USERS_DEFAULT_LIMIT: 10,
  USERS_MAX_LIMIT: 50,
  
  // Connection-specific pagination
  CONNECTIONS_DEFAULT_LIMIT: 10,
  CONNECTIONS_SUGGESTED_LIMIT: 2,
  
  // Other pagination
  RECOMMENDED_EVENTS_LIMIT: 20,
  TRENDING_EVENTS_LIMIT: 20,
  RECENT_EVENTS_LIMIT: 20,
};

// Sort options
export const SORT_OPTIONS = {
  // Event sorting
  EVENTS_SORT_BY: {
    DATE: 'start_date',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    VIEWS: 'analytics.views',
    TITLE: 'title'
  },
  
  EVENTS_SORT_ORDER: {
    ASC: 'asc',
    DESC: 'desc'
  }
};
