import { Outlet } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerHeader from "./OrganizerHeader";

const OrganizerLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <OrganizerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OrganizerHeader />
        
        <main className="flex-1 rounded-tl-xl overflow-x-hidden overflow-y-auto bg-white p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
