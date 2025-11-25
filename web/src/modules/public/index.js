// Public module index - exports all public module components and routes
export { default as PublicRoutes } from './routes';

// Re-export pages
export { default as HomePage } from './pages/HomePage';
export { default as EventsPage } from './pages/EventsPage';
export { default as GalleryPage } from './pages/GalleryPage';
export { default as MarketplacePage } from './pages/MarketplacePage';
export { default as HowItWorksPage } from './pages/HowItWorksPage';

// Re-export components
export { default as EventCard } from './components/EventCard';
export { default as EventsFilterBar } from './components/EventsFilterBar';
export { default as GalleryFeed } from './components/GalleryFeed';
export { default as Navbar } from './components/layout/Navbar';
export { default as Footer } from './components/layout/Footer';
