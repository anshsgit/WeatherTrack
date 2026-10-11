/**
 * SearchForm.jsx
 * Controlled form component with full client-side validation.
 * Demonstrates: controlled inputs, form validation, error display, useRef for focus.
 */
import React, { useState, useRef, useCallback } from 'react';
import { RiSearchLine, RiLoader4Line } from 'react-icons/ri';
import { validateCityInput } from '../utils/weatherUtils';

export default function SearchForm({ onSearch, loading }) {
  const [cityInput, setCityInput] = useState('');
  const [validationError, setValidationError] = useState(null);
  const inputRef = useRef(null);

  // Validate on every input change — provide immediate feedback
  function handleChange(e) {
    const value = e.target.value;
    setCityInput(value);
    // Clear error while the user is typing so they don't see stale messages
    if (validationError) setValidationError(null);
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const error = validateCityInput(cityInput);
      if (error) {
        setValidationError(error);
        inputRef.current?.focus();
        return;
      }
      onSearch(cityInput.trim());
    },
    [cityInput, onSearch]
  );

  const hasError = Boolean(validationError);

  return (
    <form
      id="city-search-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Search for a city"
    >
      <div className="search-bar">
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label htmlFor="city-input" className="form-label">
            Search City
          </label>
          <input
            ref={inputRef}
            id="city-input"
            type="text"
            className={`form-input${hasError ? ' error' : ''}`}
            placeholder="e.g. Mumbai, London, New York..."
            value={cityInput}
            onChange={handleChange}
            aria-invalid={hasError}
            aria-describedby={hasError ? 'city-input-error' : undefined}
            disabled={loading}
            autoComplete="off"
            spellCheck="false"
          />
          {hasError && (
            <span id="city-input-error" className="form-error" role="alert">
              ⚠ {validationError}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: hasError ? '1.6rem' : 0 }}>
          <button
            id="search-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            aria-label={loading ? 'Searching...' : 'Search'}
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Searching...
              </>
            ) : (
              <>
                <RiSearchLine aria-hidden="true" />
                Search
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
