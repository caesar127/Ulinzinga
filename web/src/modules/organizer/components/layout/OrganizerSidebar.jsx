import { Link, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  PlusCircleIcon,
  UsersIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import logo from "@/assets/logo/UlinzingaUlinzinga-2.png";
import { useSelector } from "react-redux";

const OrganizerSidebar = () => {
  const location = useLocation();
  const { business } = useSelector((state) => state.auth);

  const menuItems = [
    { path: "/organizer/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { path: "/organizer/events", label: "My Events", icon: CalendarDaysIcon },
    {
      path: "/organizer/events/create",
      label: "Create Event",
      icon: PlusCircleIcon,
    },
    { path: "/organizer/attendees", label: "Attendees", icon: UsersIcon },
    { path: "/organizer/analytics", label: "Analytics", icon: ChartBarIcon },
    { path: "/organizer/profile", label: "Profile", icon: UserCircleIcon },
  ];

  return (
    <aside className="w-64 bg-slate-50 h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-3">
        <img src={logo} alt="Ulinzinga Logo" className="h-12" />
        <h1 className="text-xl font-semibold truncate">{business?.name}</h1>
      </div>

      <nav className="mt-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-2 transition-all rounded-lg mx-2 ${
                isActive
                  ? "bg-black/10 text-gray-700 font-[500]"
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

export default OrganizerSidebar;
