export const LAYOUT_CONFIG = {
  FULL_SCREEN_ROUTES: [
    '/organizer/events',
    '/organizer/analytics',
    '/organizer/stalls',
    '/organizer/event'
  ],
  
  COMPACT_ROUTES: [
    '/organizer/dashboard'
  ],
  
  getLayoutType: (pathname) => {
    if (LAYOUT_CONFIG.FULL_SCREEN_ROUTES.some(route => pathname.startsWith(route))) {
      return 'fullscreen';
    }
    if (LAYOUT_CONFIG.COMPACT_ROUTES.some(route => pathname.startsWith(route))) {
      return 'compact';
    }
    return 'default';
  }
};

export default LAYOUT_CONFIG;