/**
 * weatherUtils.js
 * Pure utility functions for rainfall classification and statistics.
 * Keeping this separate from components makes the logic independently testable.
 */

/**
 * Classify rainfall intensity based on mm/day thresholds (IMD standard).
 * @param {number} mm — precipitation in millimetres
 * @returns {{ label: string, className: string }}
 */
export function classifyRainfall(mm) {
  if (mm === null || mm === undefined || mm < 0) {
    return { label: 'No Data', className: 'badge-none' };
  }
  if (mm === 0) return { label: 'No Rain', className: 'badge-none' };
  if (mm < 7.5)  return { label: 'Light',    className: 'badge-light' };
  if (mm < 35.5) return { label: 'Moderate', className: 'badge-moderate' };
  return           { label: 'Heavy',    className: 'badge-heavy' };
}

/**
 * Compute summary statistics from an array of rainfall records.
 * @param {Array<{ precipitation: number, date: string }>} records
 * @returns {{ total: number, average: number, maxDay: object | null, rainyDays: number }}
 */
export function computeStats(records) {
  if (!records || records.length === 0) {
    return { total: 0, average: 0, maxDay: null, rainyDays: 0 };
  }

  const total = records.reduce((sum, r) => sum + (r.precipitation ?? 0), 0);
  const average = total / records.length;

  const maxDay = records.reduce(
    (max, r) => (r.precipitation > (max?.precipitation ?? -Infinity) ? r : max),
    null
  );

  const rainyDays = records.filter((r) => r.precipitation > 0).length;

  return {
    total: parseFloat(total.toFixed(2)),
    average: parseFloat(average.toFixed(2)),
    maxDay,
    rainyDays,
  };
}

/**
 * Format an ISO date string (YYYY-MM-DD) to a human-readable format.
 * Example: "2026-10-01" → "Wed, Oct 1"
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate + 'T00:00:00'); // Force local time, no UTC offset
  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Validate a city search form field.
 * @param {string} value
 * @returns {string | null} — error message or null if valid
 */
export function validateCityInput(value) {
  const trimmed = value?.trim();
  if (!trimmed) return 'City name is required.';
  if (trimmed.length < 2) return 'City name must be at least 2 characters.';
  if (trimmed.length > 100) return 'City name is too long.';
  if (!/^[a-zA-Z\s\-'.,()\u00C0-\u024F]+$/.test(trimmed)) {
    return 'City name contains invalid characters.';
  }
  return null;
}
