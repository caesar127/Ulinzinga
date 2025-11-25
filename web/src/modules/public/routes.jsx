import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import MarketplacePage from './pages/MarketplacePage';
import HowItWorksPage from './pages/HowItWorksPage';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
    </Routes>
  );
};

export default PublicRoutes;
