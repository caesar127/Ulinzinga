import React from "react";
import { useSelector } from "react-redux";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

function VendorHeader() {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Vendor Portal</h2>
            <p className="text-sm text-gray-500">Manage your products and events</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
              <BellIcon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Vendor User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-500">
                <UserCircleIcon className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default VendorHeader;
