import { Link, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  UsersIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import logo from "@/assets/logo/UlinzingaUlinzinga-2.png";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { path: "/admin/users", label: "Users", icon: UsersIcon },
    { path: "/admin/events", label: "Events", icon: CalendarDaysIcon },
    { path: "/admin/vendors", label: "Vendors", icon: BuildingStorefrontIcon },
    { path: "/admin/organizers", label: "Organizers", icon: UserGroupIcon },
    { path: "/admin/analytics", label: "Analytics", icon: ChartBarIcon },
    { path: "/admin/reports", label: "Reports", icon: DocumentTextIcon },
    { path: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 bg-black h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-3">
        <img src={logo} alt="Ulinzinga Logo" className="h-12" />
        <h1 className="text-xl font-[500] text-white truncate">
          Admin Panel
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

export default AdminSidebar;
