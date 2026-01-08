import { Outlet, useLocation } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerHeader from "./OrganizerHeader";
import LAYOUT_CONFIG from "../../config/layoutConfig";
import { useState } from "react";
import { useEffect } from "react";

const OrganizerLayout = () => {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const layoutType = LAYOUT_CONFIG.getLayoutType(location.pathname);
    setShowHeader(layoutType !== "fullscreen");
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <OrganizerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && <OrganizerHeader />}

        <main
          className={`flex-1 rounded-tl-xl overflow-x-hidden overflow-y-auto ${
            !showHeader ? "p-0" : "p-3"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
