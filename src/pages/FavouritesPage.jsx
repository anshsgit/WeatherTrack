/**
 * FavouritesPage.jsx
 * Displays saved locations with CRUD operations: view, delete, edit note.
 * Demonstrates: useContext (useFavourites), CRUD, Search & Filter, useDebounce.
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  RiHeartLine,
  RiDeleteBinLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiSearchLine,
} from 'react-icons/ri';
import { useFavourites } from '../context/FavouritesContext';
import { useDebounce } from '../hooks/useDebounce';
import '../styles/Pages.css';

// Inline edit form for the note field on a favourite card
function NoteEditor({ currentNote, onSave, onCancel }) {
  const [draft, setDraft] = useState(currentNote);

  return (
    <div style={{ marginTop: 'var(--space-sm)' }}>
      <textarea
        id="note-edit-textarea"
        className="form-textarea"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add a personal note about this location..."
        rows={2}
        style={{ resize: 'vertical', marginBottom: 6 }}
        aria-label="Edit note"
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          id="note-save-btn"
          className="btn btn-primary btn-icon"
          onClick={() => onSave(draft)}
          aria-label="Save note"
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
        >
          <RiCheckLine aria-hidden="true" /> Save
        </button>
        <button
          id="note-cancel-btn"
          className="btn btn-secondary btn-icon"
          onClick={onCancel}
          aria-label="Cancel editing"
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
        >
          <RiCloseLine aria-hidden="true" /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function FavouritesPage() {
  const { favourites, removeFavourite, updateNote } = useFavourites();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Debounce the search query for smooth filtering
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Filter favourites by city name or country
  const filteredFavourites = useMemo(() => {
    if (!debouncedQuery.trim()) return favourites;
    const q = debouncedQuery.toLowerCase();
    return favourites.filter(
      (fav) =>
        fav.name.toLowerCase().includes(q) ||
        fav.country.toLowerCase().includes(q)
    );
  }, [favourites, debouncedQuery]);

  function handleSaveNote(id, note) {
    updateNote(id, note.trim());
    setEditingId(null);
  }

  function formatSavedDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <main className="page-wrapper route-transition">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <h1>Saved Locations</h1>
          <p>Manage your favourite cities. Add personal notes or remove locations you no longer need.</p>
        </header>

        {/* Empty State — no favourites at all */}
        {favourites.length === 0 && (
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon" aria-hidden="true">
              <RiHeartLine size={48} />
            </div>
            <h3>No saved locations yet</h3>
            <p>
              Search for a city on the Dashboard and click{' '}
              <strong>Save Location</strong> to add it here.
            </p>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Search bar — shown only when there are favourites */}
        {favourites.length > 0 && (
          <>
            <div style={{ marginBottom: 'var(--space-xl)', maxWidth: 420 }}>
              <label htmlFor="fav-search-input" className="form-label">
                Filter Locations
              </label>
              <div style={{ position: 'relative' }}>
                <RiSearchLine
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                  aria-hidden="true"
                />
                <input
                  id="fav-search-input"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                  placeholder="Search by city or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter saved locations"
                />
              </div>
              <p
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}
                aria-live="polite"
              >
                {filteredFavourites.length} of {favourites.length} locations
              </p>
            </div>

            {/* No results after filtering */}
            {filteredFavourites.length === 0 && (
              <div className="empty-state animate-fade-in">
                <div className="empty-state-icon" aria-hidden="true">🔍</div>
                <h3>No results found</h3>
                <p>Try a different search term.</p>
              </div>
            )}

            {/* Favourites Grid */}
            <div className="favorites-grid">
              {filteredFavourites.map((fav, index) => (
                <article
                  key={fav.id}
                  id={`fav-card-${fav.id}`}
                  className="favorite-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  aria-label={`Saved location: ${fav.name}, ${fav.country}`}
                >
                  {/* Card Header */}
                  <div className="favorite-card-header">
                    <div>
                      <div className="favorite-city">{fav.name}</div>
                      {fav.admin1 && (
                        <div className="favorite-country">{fav.admin1}, {fav.country}</div>
                      )}
                      {!fav.admin1 && (
                        <div className="favorite-country">{fav.country}</div>
                      )}
                    </div>
                    <div className="favorite-actions">
                      <button
                        id={`edit-note-btn-${fav.id}`}
                        className="btn btn-secondary btn-icon"
                        onClick={() => setEditingId(editingId === fav.id ? null : fav.id)}
                        aria-label={`Edit note for ${fav.name}`}
                        title="Edit note"
                      >
                        <RiEditLine size={15} aria-hidden="true" />
                      </button>
                      <button
                        id={`remove-fav-btn-${fav.id}`}
                        className="btn btn-danger btn-icon"
                        onClick={() => removeFavourite(fav.id)}
                        aria-label={`Remove ${fav.name} from favourites`}
                        title="Remove"
                      >
                        <RiDeleteBinLine size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="favorite-meta">
                    📍 {fav.lat.toFixed(3)}°N, {fav.lon.toFixed(3)}°E
                  </div>
                  <div className="favorite-meta">
                    🗓 Saved on {formatSavedDate(fav.savedAt)}
                  </div>

                  {/* Note display */}
                  {fav.note && editingId !== fav.id && (
                    <div className="favorite-note">"{fav.note}"</div>
                  )}

                  {/* Inline note editor */}
                  {editingId === fav.id && (
                    <NoteEditor
                      currentNote={fav.note}
                      onSave={(note) => handleSaveNote(fav.id, note)}
                      onCancel={() => setEditingId(null)}
                    />
                  )}

                  {/* Quick link to dashboard */}
                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <Link
                      to="/dashboard"
                      id={`view-dashboard-${fav.id}`}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
                      state={{ prefill: fav.name }}
                    >
                      View on Dashboard →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
