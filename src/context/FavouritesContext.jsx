/**
 * FavouritesContext.jsx
 * Provides global CRUD state for saved favourite locations.
 * Uses localStorage for persistence across sessions.
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FavouritesContext = createContext(null);

// Storage key for persistence
const STORAGE_KEY = 'weathertrack_favourites';

// Load initial state from localStorage (or empty array if not present)
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Pure reducer — every action returns a new state
function favouritesReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      // Prevent duplicate entries by latitude/longitude
      const alreadyExists = state.some(
        (fav) => fav.lat === action.payload.lat && fav.lon === action.payload.lon
      );
      if (alreadyExists) return state;
      return [action.payload, ...state];
    }
    case 'REMOVE':
      return state.filter((fav) => fav.id !== action.payload);
    case 'UPDATE_NOTE':
      return state.map((fav) =>
        fav.id === action.payload.id ? { ...fav, note: action.payload.note } : fav
      );
    default:
      return state;
  }
}

export function FavouritesProvider({ children }) {
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFromStorage);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // Storage quota exceeded or unavailable — fail silently
    }
  }, [favourites]);

  function addFavourite(location) {
    dispatch({
      type: 'ADD',
      payload: {
        id: `${location.lat}_${location.lon}`,
        name: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        note: '',
        savedAt: new Date().toISOString(),
      },
    });
  }

  function removeFavourite(id) {
    dispatch({ type: 'REMOVE', payload: id });
  }

  function updateNote(id, note) {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, note } });
  }

  function isFavourite(lat, lon) {
    return favourites.some((fav) => fav.lat === lat && fav.lon === lon);
  }

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite, updateNote, isFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
