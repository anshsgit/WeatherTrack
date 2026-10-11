/**
 * useLocalStorage.js — Custom Hook
 * A generic hook that syncs any state value with localStorage.
 * Demonstrates: useState, useEffect, generics pattern in vanilla JS hooks.
 */
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Write to localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Fail silently — storage unavailable (e.g., private browsing with quota 0)
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
