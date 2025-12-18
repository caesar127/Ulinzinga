import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import AuthCallbackPage from "./pages/auth/AuthCallbackPage";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import MarketplacePage from "./pages/MarketplacePage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./shared/ProtectedRoute";

import { OrganizerRoutes } from "./modules/organizer";
import { AdminRoutes } from "./modules/admin";
import { VendorRoutes } from "./modules/vendor";
import EmptyLayout from "./shared/layout/EmptyLayout";
import MainLayout from "./shared/layout/MainLayout";
import EventDetailsPage from "./pages/EventDetailsPage";
import TicketPurchaseRedirectPage from "./pages/TicketPurchaseRedirectPage";
import WalletPage from "./pages/WalletPage";
import PaymentRedirectPage from "./pages/PaymentRedirectPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<EmptyLayout />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/payment/redirect" element={<PaymentRedirectPage />} />

          <Route path="/organizer/*" element={<OrganizerRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/vendor/*" element={<VendorRoutes />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/eventdetails" element={<EventDetailsPage />} />
          <Route
            path="/ticketpurchase"
            element={<TicketPurchaseRedirectPage />}
          />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
