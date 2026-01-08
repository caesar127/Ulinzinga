import { useSelector } from "react-redux";
import { BellIcon } from "@heroicons/react/24/outline";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="">
      <div className="flex items-center justify-end px-3 py-4">
        
        <div className="flex items-center space-x-6">

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-[#FFB300] transition-colors">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center text-white text-lg font-[500]">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
