import { Outlet } from "react-router-dom";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";

const VendorLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendorHeader />

        <main className="flex-1 rounded-tl-2xl overflow-x-hidden overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
