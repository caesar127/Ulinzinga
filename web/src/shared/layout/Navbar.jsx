import React, { useState } from "react";
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

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white">
      <div className="mx-auto py-4 px-4 md:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Ulinzinga" className="h-14 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm">
            <Link to="/" className="px-3 py-2">
              Home
            </Link>
            <Link to="/events" className="px-3 py-2">
              Explore Events
            </Link>
            <Link to="/marketplace" className="px-3 py-2">
              Marketplace
            </Link>
            <Link to="/gallery" className="px-3 py-2">
              Gallery
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="px-3 py-2 font-medium"
              >
                Profile
              </Link>
            ) : null}

            <button
              className=" p-2 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <img src={menuicon} alt="Menu Icon" className="h-7 w-7" />
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <img src={menuicon} alt="Menu Icon" className="h-7 w-7" />
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-60" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-3 pt-4 pb-6">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm border-b"
            >
              Home
            </Link>

            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm border-b"
            >
              Explore Events
            </Link>

            <Link
              to="/marketplace"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm border-b"
            >
              Marketplace
            </Link>

            <Link
              to="/gallery"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm border-b"
            >
              Gallery
            </Link>

            {/* User Actions */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm border-b"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-2 text-sm text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm text-black"
              >
                Sign In / Create Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
