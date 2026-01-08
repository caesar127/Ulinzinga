import { Link, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  CubeIcon,
  ShoppingBagIcon,
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
    { path: "/vendor/events", label: "Events", icon: CalendarDaysIcon },
    { path: "/vendor/transactions", label: "Transactions", icon: CubeIcon },
    { path: "/vendor/mystalls", label: "My Stalls", icon: ShoppingBagIcon },
    { path: "/vendor/profile", label: "Profile", icon: UserCircleIcon },
  ];

  return (
    <aside className="w-64 bg-black h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-3">
        <img src={logo} alt="Ulinzinga Logo" className="h-12" />
        <h1 className="text-xl font-[500] text-white truncate">
          {business?.name || "Vendor"}
        </h1>
      </div>

      <h1 className="text-[#8B909A] mx-6 mt-4 mb-2 text-xs">MAIN MENU</h1>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-[300] transition-all
                ${
                  isActive
                    ? "border-l-4 border-[#FFB300] text-white bg-[#1A1A1A]"
                    : "text-[#809FB8] hover:text-white hover:bg-[#1A1A1A]"
                }
              `}
            >
              <Icon
                className={`h-5 w-5 mr-3 ${
                  isActive ? "text-white" : "text-[#809FB8]"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default VendorSidebar;
