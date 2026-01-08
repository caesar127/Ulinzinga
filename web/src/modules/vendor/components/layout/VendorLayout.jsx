import React from "react";
import { Outlet } from "react-router-dom";
import VendorHeader from "./VendorHeader";
import VendorSidebar from "./VendorSidebar";

function VendorLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
