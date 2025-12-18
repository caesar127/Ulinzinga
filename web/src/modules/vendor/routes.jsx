import { Routes, Route } from "react-router-dom";
import VendorDashboardPage from "./pages/DashboardPage";
import VendorEventsPage from "./pages/EventsPage";
import VendorProductsPage from "./pages/ProductsPage";
import VendorOrdersPage from "./pages/OrdersPage";
import VendorAnalyticsPage from "./pages/AnalyticsPage";
import VendorProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "@/shared/ProtectedRoute";
import VendorLayout from "./components/layout/VendorLayout";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
        <Route element={<VendorLayout />}>
          <Route path="dashboard" element={<VendorDashboardPage />} />
          <Route path="events" element={<VendorEventsPage />} />
          <Route path="products" element={<VendorProductsPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="analytics" element={<VendorAnalyticsPage />} />
          <Route path="profile" element={<VendorProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
