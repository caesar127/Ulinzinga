import { Link, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import logo from "@/assets/logo/UlinzingaUlinzinga-2.png";
import { useSelector } from "react-redux";

const VendorSidebar = () => {
  const location = useLocation();
  const { business } = useSelector((state) => state.auth);

  const menuItems = [
    { path: "/vendor/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { path: "/vendor/services", label: "Services", icon: ShoppingBagIcon },
    { path: "/vendor/bookings", label: "Bookings", icon: CalendarDaysIcon },
    { path: "/vendor/revenues", label: "Revenues", icon: ChartBarIcon },
    { path: "/vendor/profile", label: "Profile", icon: UserCircleIcon },
  ];

  return (
    <aside className="w-64 bg-slate-50 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center space-x-3">
        <img src={logo} alt="Ulinzinga Logo" className="h-12" />
        <h1 className="text-xl font-semibold truncate">
          {business?.name || "Vendor Portal"}
        </h1>
      </div>

      {/* Menu */}
      <nav className="mt-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-2 transition-all rounded-lg mx-2 my-1 ${
                isActive
                  ? "bg-black/10 text-gray-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon
                className={`h-6 w-6 mr-3 transition-colors ${
                  isActive ? "text-[#FFB300]" : "text-gray-500"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default VendorSidebar;
