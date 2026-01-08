// Admin module index - exports all admin module components and routes
export { default as AdminRoutes } from './routes';

// Re-export layout components
export { default as AdminLayout } from './components/layout/AdminLayout';
export { default as AdminSidebar } from './components/layout/AdminSidebar';
export { default as AdminHeader } from './components/layout/AdminHeader';

// Re-export pages
export { default as AdminDashboardPage } from './pages/DashboardPage';
// export { default as UsersPage } from './pages/UsersPage';
// export { default as AdminEventsPage } from './pages/EventsPage';
// export { default as VendorsPage } from './pages/VendorsPage';
// export { default as OrganizersPage } from './pages/OrganizersPage';
// export { default as AdminAnalyticsPage } from './pages/AnalyticsPage';
// export { default as SettingsPage } from './pages/SettingsPage';
// export { default as ReportsPage } from './pages/ReportsPage';
