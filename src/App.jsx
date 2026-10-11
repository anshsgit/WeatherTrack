/**
 * App.jsx
 * Root application component.
 * Sets up React Router routes, wraps everything in ErrorBoundary and FavouritesProvider.
 * Demonstrates: BrowserRouter, Routes, Route, Suspense, ErrorBoundary, Context Provider.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { FavouritesProvider } from './context/FavouritesContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route-level code splitting with React.lazy
// Each page is loaded only when its route is visited
const HomePage       = lazy(() => import('./pages/HomePage'));
const DashboardPage  = lazy(() => import('./pages/DashboardPage'));
const FavouritesPage = lazy(() => import('./pages/FavouritesPage'));
const AboutPage      = lazy(() => import('./pages/AboutPage'));
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'));

// Page-level loading fallback
function PageLoader() {
  return (
    <div className="spinner-wrapper" role="status" aria-label="Loading page">
      <div className="spinner" aria-hidden="true" />
      <p>Loading...</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Global error boundary catches any crash in the component tree */}
      <ErrorBoundary>
        {/* Provides favourites CRUD state to all components via context */}
        <FavouritesProvider>
          <Navbar />

          {/* Suspense wraps lazy-loaded page components */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"            element={<HomePage />} />
              <Route path="/dashboard"   element={<DashboardPage />} />
              <Route path="/favourites"  element={<FavouritesPage />} />
              <Route path="/about"       element={<AboutPage />} />
              {/* Catch-all 404 route */}
              <Route path="*"            element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          <Footer />
        </FavouritesProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
