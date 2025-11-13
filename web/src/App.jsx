import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import MarketplacePage from "./pages/MarketplacePage";
import GalleryPage from "./pages/GalleryPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import { selectIsAuthenticated } from "./features/auth/authSlice";
import Footer from "./components/layout/Footer";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
