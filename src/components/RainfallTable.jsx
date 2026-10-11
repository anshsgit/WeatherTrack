/**
 * RainfallTable.jsx
 * Sortable, filterable data table for the 14-day rainfall records.
 * Demonstrates: useState (filter/sort), useMemo (filtered data), Search & Filter.
 */
import React, { useState, useMemo } from 'react';
import { RiFilterLine, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { classifyRainfall, formatDate } from '../utils/weatherUtils';

const FILTER_OPTIONS = [
  { value: 'all',      label: 'All Days' },
  { value: 'none',     label: 'No Rain' },
  { value: 'light',    label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'heavy',    label: 'Heavy' },
];

export default function RainfallTable({ records }) {
  const [filterLabel, setFilterLabel] = useState('all');
  const [sortAsc, setSortAsc] = useState(false); // Default: newest first

  // Filter + sort records — recomputed only when dependencies change
  const processedRecords = useMemo(() => {
    if (!records) return [];

    const filtered = records.filter((r) => {
      if (filterLabel === 'all') return true;
      const { label } = classifyRainfall(r.precipitation);
      return label.toLowerCase() === filterLabel;
    });

    return [...filtered].sort((a, b) =>
      sortAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
  }, [records, filterLabel, sortAsc]);

  if (!records || records.length === 0) return null;

  return (
    <section aria-label="Daily rainfall records table">
      {/* Controls Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-md)',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
        }}
      >
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          🗓 Daily Breakdown
        </h2>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <RiFilterLine color="var(--text-muted)" aria-hidden="true" />
          <select
            id="rainfall-filter-select"
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 2rem 0.45rem 0.75rem' }}
            value={filterLabel}
            onChange={(e) => setFilterLabel(e.target.value)}
            aria-label="Filter records by rainfall intensity"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className="card"
        style={{ padding: 0, overflowX: 'auto' }}
        role="region"
        aria-label="Rainfall data table"
      >
        <table className="data-table" aria-label="14-day rainfall data">
          <thead>
            <tr>
              <th scope="col">
                <button
                  id="sort-date-btn"
                  onClick={() => setSortAsc((prev) => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    textTransform: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                  aria-label={`Sort by date ${sortAsc ? 'descending' : 'ascending'}`}
                >
                  Date
                  {sortAsc ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </button>
              </th>
              <th scope="col">Precipitation (mm)</th>
              <th scope="col">Max Temp (°C)</th>
              <th scope="col">Min Temp (°C)</th>
              <th scope="col">Intensity</th>
            </tr>
          </thead>
          <tbody>
            {processedRecords.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No records match the selected filter.
                </td>
              </tr>
            ) : (
              processedRecords.map((record) => {
                const { label, className } = classifyRainfall(record.precipitation);
                return (
                  <tr key={record.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {formatDate(record.date)}
                    </td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {(record.precipitation ?? 0).toFixed(2)}
                    </td>
                    <td>
                      {record.tempMax !== null ? `${record.tempMax}°` : '—'}
                    </td>
                    <td>
                      {record.tempMin !== null ? `${record.tempMin}°` : '—'}
                    </td>
                    <td>
                      <span className={`badge ${className}`}>{label}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p
        style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}
        aria-live="polite"
      >
        Showing {processedRecords.length} of {records.length} records
      </p>
    </section>
  );
}
