/**
 * useDebounce.js — Custom Hook
 * Delays updating a value until the user stops typing.
 * Used for the search input to avoid firing an API call on every keystroke.
 * Demonstrates: useState, useEffect, performance optimization via debouncing.
 */
import { useState, useEffect } from 'react';

export function useDebounce(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cleanup: cancel the timeout if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
