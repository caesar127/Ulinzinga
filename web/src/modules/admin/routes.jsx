import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../shared/components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import EventsPage from './pages/EventsPage';
import VendorsPage from './pages/VendorsPage';
import OrganizersPage from './pages/OrganizersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/organizers" element={<OrganizersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
