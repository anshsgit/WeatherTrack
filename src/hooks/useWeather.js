/**
 * useWeather.js — Custom Hook
 * Fetches geocoding + 14-day rainfall data from Open-Meteo APIs.
 * Demonstrates: useState, useEffect, useCallback, error handling, AbortController.
 */
import { useState, useCallback, useRef } from 'react';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Calculate date range — past N days up to today
function getDateRange(days = 14) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const fmt = (d) => d.toISOString().split('T')[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}

export function useWeather() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep a ref to the latest AbortController so we can cancel stale requests
  const abortRef = useRef(null);

  const fetchWeather = useCallback(async (cityName) => {
    // Cancel any in-flight request before starting a new one
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);
    setLocation(null);

    try {
      // Step 1: Geocoding — resolve city name to lat/lon
      const geoRes = await fetch(
        `${GEO_API}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
        { signal: controller.signal }
      );

      if (!geoRes.ok) throw new Error(`Geocoding request failed (HTTP ${geoRes.status})`);

      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Location "${cityName}" not found. Please try a different city name.`);
      }

      const place = geoData.results[0];
      const { latitude, longitude, name, country, admin1 } = place;

      // Step 2: Weather data — precipitation for the past 14 days
      const { startDate, endDate } = getDateRange(14);
      const weatherRes = await fetch(
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}` +
        `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min` +
        `&start_date=${startDate}&end_date=${endDate}` +
        `&timezone=auto`,
        { signal: controller.signal }
      );

      if (!weatherRes.ok) throw new Error(`Weather request failed (HTTP ${weatherRes.status})`);

      const weatherData = await weatherRes.json();

      // Build structured records from parallel arrays
      const records = weatherData.daily.time.map((date, i) => ({
        id: `${date}-${i}`,
        date,
        precipitation: weatherData.daily.precipitation_sum[i] ?? 0,
        tempMax: weatherData.daily.temperature_2m_max[i],
        tempMin: weatherData.daily.temperature_2m_min[i],
      }));

      setLocation({ name, country, admin1, lat: latitude, lon: longitude });
      setData(records);
    } catch (err) {
      // Ignore AbortError — it's intentional cancellation, not a real error
      if (err.name !== 'AbortError') {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, location, loading, error, fetchWeather };
}
