// Organizer module index - exports all organizer module components and routes
export { default as OrganizerRoutes } from './routes';

// Re-export layout components
export { default as OrganizerLayout } from './components/layout/OrganizerLayout';
export { default as OrganizerSidebar } from './components/layout/OrganizerSidebar';
export { default as OrganizerHeader } from './components/layout/OrganizerHeader';

// Re-export pages
export { default as OrganizerDashboardPage } from './pages/DashboardPage';
export { default as OrganizerEventsPage } from './pages/EventsPage';
export { default as AttendeesPage } from './pages/AttendeesPage';
export { default as OrganizerAnalyticsPage } from './pages/AnalyticsPage';
export { default as OrganizerProfilePage } from './pages/ProfilePage';
