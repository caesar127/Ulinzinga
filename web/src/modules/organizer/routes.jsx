import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import EventManagementPage from "./pages/EventManagementPage";
import AttendeesPage from "./pages/AttendeesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "@/shared/ProtectedRoute";
import OrganizerLayout from "./components/layout/OrganizerLayout";
import TransactionsPage from "./pages/TransactionsPage";
import StallsPage from "./pages/StallsPage";

const OrganizerRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
        <Route element={<OrganizerLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="event" element={<EventManagementPage />} />
          <Route path="stalls/:eventId" element={<StallsPage />} />
          <Route path="transaction" element={<TransactionsPage />} />
          <Route path="attendees" element={<AttendeesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default OrganizerRoutes;
