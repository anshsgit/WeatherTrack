/**
 * DashboardPage.jsx
 * Core weather dashboard — search, stats, chart, table, favourites.
 * Demonstrates: useWeather (custom hook), useMemo, useCallback, useLocalStorage,
 *   useFavourites (context), lazy loading (React.lazy), Suspense.
 */
import React, { useMemo, useCallback, lazy, Suspense } from 'react';
import { RiHeartLine, RiHeartFill, RiHistoryLine, RiCloseLine } from 'react-icons/ri';
import { WiRaindrop } from 'react-icons/wi';

import { useWeather } from '../hooks/useWeather';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useFavourites } from '../context/FavouritesContext';
import { computeStats } from '../utils/weatherUtils';

import SearchForm from '../components/SearchForm';
import StatsCards from '../components/StatsCards';
import RainfallTable from '../components/RainfallTable';

// Lazy-load the heavy Recharts component — demonstrates code splitting / performance optimisation
const RainfallChart = lazy(() => import('../components/RainfallChart'));

const MAX_HISTORY = 8;

export default function DashboardPage() {
  const { data, location, loading, error, fetchWeather } = useWeather();
  const [searchHistory, setSearchHistory] = useLocalStorage('weathertrack_history', []);
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();

  // Memoised statistics — only recalculated when data changes
  const stats = useMemo(() => computeStats(data), [data]);

  // Handle search submission — update history and fetch data
  const handleSearch = useCallback(
    (city) => {
      // Save to search history (deduplicate, keep newest at front)
      setSearchHistory((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
        return [city, ...filtered].slice(0, MAX_HISTORY);
      });
      fetchWeather(city);
    },
    [fetchWeather, setSearchHistory]
  );

  // Toggle favourite status for the current location
  const handleFavouriteToggle = useCallback(() => {
    if (!location) return;
    if (isFavourite(location.lat, location.lon)) {
      removeFavourite(`${location.lat}_${location.lon}`);
    } else {
      addFavourite(location);
    }
  }, [location, isFavourite, addFavourite, removeFavourite]);

  const currentIsFav = location ? isFavourite(location.lat, location.lon) : false;

  return (
    <main className="page-wrapper route-transition">
      <div className="container">
        {/* Page Header */}
        <header className="page-header">
          <h1>Weather Dashboard</h1>
          <p>Search any city to explore the last 14 days of rainfall and temperature data.</p>
        </header>

        {/* Search Card */}
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <SearchForm onSearch={handleSearch} loading={loading} />

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <RiHistoryLine aria-hidden="true" /> Recent searches
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {searchHistory.map((city) => (
                  <button
                    key={city}
                    id={`history-btn-${city.replace(/\s+/g, '-').toLowerCase()}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
                    onClick={() => handleSearch(city)}
                    aria-label={`Search again for ${city}`}
                  >
                    {city}
                  </button>
                ))}
                <button
                  id="clear-history-btn"
                  className="btn btn-danger"
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
                  onClick={() => setSearchHistory([])}
                  aria-label="Clear search history"
                >
                  <RiCloseLine aria-hidden="true" /> Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="spinner-wrapper" role="status" aria-label="Loading weather data">
            <div className="spinner" aria-hidden="true" />
            <p>Fetching weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-error animate-fade-in" role="alert">
            <span aria-hidden="true">⚠</span>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Results */}
        {data && location && !loading && (
          <div className="dashboard-layout animate-fade-in-up">
            {/* Location Header */}
            <div className="dashboard-location-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <WiRaindrop size={28} color="var(--color-accent-blue)" aria-hidden="true" />
                <div>
                  <h2 id="location-name" style={{ fontSize: '1.4rem', marginBottom: 0 }}>
                    {location.name}
                    {location.admin1 ? `, ${location.admin1}` : ''}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
                    {location.country} &middot; {location.lat.toFixed(3)}°N, {location.lon.toFixed(3)}°E
                  </p>
                </div>
              </div>

              <button
                id="favourite-toggle-btn"
                className={`btn ${currentIsFav ? 'btn-danger' : 'btn-secondary'} location-fav-btn`}
                onClick={handleFavouriteToggle}
                aria-label={currentIsFav ? 'Remove from favourites' : 'Add to favourites'}
              >
                {currentIsFav ? (
                  <><RiHeartFill aria-hidden="true" /> Saved</>
                ) : (
                  <><RiHeartLine aria-hidden="true" /> Save Location</>
                )}
              </button>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Chart — lazily loaded with Suspense fallback */}
            <Suspense
              fallback={
                <div className="spinner-wrapper">
                  <div className="spinner" aria-hidden="true" />
                </div>
              }
            >
              <RainfallChart records={data} />
            </Suspense>

            {/* Data Table */}
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <RainfallTable records={data} />
            </div>
          </div>
        )}

        {/* Initial empty state */}
        {!data && !loading && !error && (
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon" aria-hidden="true">🌍</div>
            <h3>Search for a city to get started</h3>
            <p>
              Type any city name in the search box above. WeatherTrack will fetch
              the last 14 days of rainfall and temperature data for that location.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
