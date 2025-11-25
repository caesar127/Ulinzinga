import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../shared/components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import BookingsPage from './pages/BookingsPage';
import RevenuesPage from './pages/RevenuesPage';
import ProfilePage from './pages/ProfilePage';

const VendorRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/revenues" element={<RevenuesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
