import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import logo from "../../assets/logo/UlinzingaUlinzinga-1.png";
import menuicon from "../../assets/icons/Menuicon.svg";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => ({
    user: state.auth.user,
    isAuthenticated: !!state.auth.token,
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white">
      <div className="mx-auto py-4 px-4 md:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Ulinzinga" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="text-sm">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/events"
                className={`px-3 py-2 rounded-md text-sm transition-colors`}
              >
                Explore Events
              </Link>
              <Link
                to="/marketplace"
                className={`px-3 py-2 rounded-md text-sm transition-colors`}
              >
                Marketplace
              </Link>
              <Link
                to="/gallery"
                className={`px-3 py-2 rounded-md text-sm transition-colors`}
              >
                Gallery
              </Link>
              <img
                src={menuicon}
                alt="Menu Icon"
                className="h-8 w-8 rounded-md hover:opacity-80 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
