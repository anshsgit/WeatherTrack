/**
 * weatherUtils.test.js
 * Unit tests for pure utility functions in weatherUtils.js.
 * These tests have no React rendering — they're fast, isolated unit tests.
 *
 * Run with: npm test
 */
import { describe, it, expect } from 'vitest';
import {
  classifyRainfall,
  computeStats,
  formatDate,
  validateCityInput,
} from '../utils/weatherUtils';

// ─── classifyRainfall ────────────────────────────────────────────────────────

describe('classifyRainfall', () => {
  it('returns "No Rain" for 0 mm', () => {
    const result = classifyRainfall(0);
    expect(result.label).toBe('No Rain');
    expect(result.className).toBe('badge-none');
  });

  it('returns "Light" for values between 0 and 7.5 mm', () => {
    expect(classifyRainfall(1).label).toBe('Light');
    expect(classifyRainfall(7.4).label).toBe('Light');
  });

  it('returns "Moderate" for values between 7.5 and 35.5 mm', () => {
    expect(classifyRainfall(7.5).label).toBe('Moderate');
    expect(classifyRainfall(20).label).toBe('Moderate');
  });

  it('returns "Heavy" for values above 35.5 mm', () => {
    expect(classifyRainfall(35.5).label).toBe('Heavy');
    expect(classifyRainfall(100).label).toBe('Heavy');
  });

  it('returns "No Data" for null or undefined', () => {
    expect(classifyRainfall(null).label).toBe('No Data');
    expect(classifyRainfall(undefined).label).toBe('No Data');
  });
});

// ─── computeStats ────────────────────────────────────────────────────────────

describe('computeStats', () => {
  const MOCK_RECORDS = [
    { id: '1', date: '2026-09-23', precipitation: 0,   tempMax: 30, tempMin: 22 },
    { id: '2', date: '2026-09-24', precipitation: 5,   tempMax: 28, tempMin: 20 },
    { id: '3', date: '2026-09-25', precipitation: 40,  tempMax: 25, tempMin: 18 },
    { id: '4', date: '2026-09-26', precipitation: 10,  tempMax: 27, tempMin: 19 },
  ];

  it('calculates total rainfall correctly', () => {
    const { total } = computeStats(MOCK_RECORDS);
    expect(total).toBe(55);
  });

  it('calculates the correct daily average', () => {
    const { average } = computeStats(MOCK_RECORDS);
    expect(average).toBe(13.75);
  });

  it('identifies the correct peak rainfall day', () => {
    const { maxDay } = computeStats(MOCK_RECORDS);
    expect(maxDay.date).toBe('2026-09-25');
    expect(maxDay.precipitation).toBe(40);
  });

  it('counts the correct number of rainy days', () => {
    const { rainyDays } = computeStats(MOCK_RECORDS);
    expect(rainyDays).toBe(3); // day with 0 mm is excluded
  });

  it('returns zero stats for an empty array', () => {
    const result = computeStats([]);
    expect(result.total).toBe(0);
    expect(result.average).toBe(0);
    expect(result.maxDay).toBeNull();
    expect(result.rainyDays).toBe(0);
  });

  it('returns zero stats for null input', () => {
    const result = computeStats(null);
    expect(result.total).toBe(0);
  });
});

// ─── formatDate ──────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('returns a non-empty formatted string for a valid ISO date', () => {
    const result = formatDate('2026-10-01');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns an empty string for null or undefined input', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });
});

// ─── validateCityInput ───────────────────────────────────────────────────────

describe('validateCityInput', () => {
  it('returns null for a valid city name', () => {
    expect(validateCityInput('Mumbai')).toBeNull();
    expect(validateCityInput('New York')).toBeNull();
    expect(validateCityInput("Saint-Étienne")).toBeNull();
  });

  it('returns an error for an empty input', () => {
    expect(validateCityInput('')).toMatch(/required/i);
    expect(validateCityInput('  ')).toMatch(/required/i);
  });

  it('returns an error for a single character input', () => {
    expect(validateCityInput('A')).toMatch(/at least 2/i);
  });

  it('returns an error for inputs with invalid characters', () => {
    expect(validateCityInput('City123')).toMatch(/invalid/i);
    expect(validateCityInput('City@!')).toMatch(/invalid/i);
  });

  it('returns an error for extremely long input', () => {
    const longInput = 'A'.repeat(101);
    expect(validateCityInput(longInput)).toMatch(/too long/i);
  });
});
