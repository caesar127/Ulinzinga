import { useSelector } from "react-redux";
import { BellIcon } from "@heroicons/react/24/outline";

const VendorHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-slate-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-xl font-medium text-gray-800">
            Welcome back, {user?.name || "Vendor"}
          </h1>
          <p className="text-xs text-gray-600">
            Manage your services and bookings
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <button className="relative p-2 text-gray-600 hover:text-[#FFB300] transition-colors">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center text-white text-lg font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || "V"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
