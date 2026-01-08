import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import LAYOUT_CONFIG from "../../config/layoutConfig";

const AdminLayout = () => {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const layoutType = LAYOUT_CONFIG.getLayoutType(location.pathname);
    setShowHeader(layoutType !== 'fullscreen');
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && <AdminHeader />}

        <main 
          className={`flex-1 rounded-tl-xl overflow-x-hidden overflow-y-auto ${
            !showHeader ? 'p-0' : 'p-3'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
