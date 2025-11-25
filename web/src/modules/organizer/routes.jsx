import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import AttendeesPage from "./pages/AttendeesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "@/shared/ProtectedRoute";
import OrganizerLayout from "./components/layout/OrganizerLayout";

const OrganizerRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
        <Route element={<OrganizerLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="attendees" element={<AttendeesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default OrganizerRoutes;
