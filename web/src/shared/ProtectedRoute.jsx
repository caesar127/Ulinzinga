import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../features/auth/authSlice";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { loading } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  if (allowedRoles.length > 0 && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      if (user.role === 'vendor') {
        return <Navigate to="/vendor/dashboard" replace />;
      } else if (user.role === 'organizer') {
        return <Navigate to="/organizer/dashboard" replace />;
      } else if (user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
