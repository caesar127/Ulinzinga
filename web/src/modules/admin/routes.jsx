import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../shared/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
