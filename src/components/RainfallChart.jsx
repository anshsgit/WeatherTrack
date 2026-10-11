/**
 * RainfallChart.jsx
 * Interactive bar chart using Recharts library.
 * Demonstrates: third-party library integration, responsive charts, memoized data transforms.
 */
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatDate } from '../utils/weatherUtils';

// Custom tooltip component for the chart
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        fontSize: '0.85rem',
        color: 'var(--text-primary)',
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ color: 'var(--color-accent-blue)' }}>
        {value.toFixed(2)} mm precipitation
      </p>
    </div>
  );
}

// Determine bar colour based on precipitation amount
function getBarColor(value) {
  if (value === 0)    return '#334155';  // slate — no rain
  if (value < 7.5)   return '#34d399';  // emerald — light
  if (value < 35.5)  return '#fbbf24';  // amber — moderate
  return '#f87171';                      // rose — heavy
}

export default function RainfallChart({ records }) {
  // Transform records into Recharts-compatible format — memoized for performance
  const chartData = useMemo(() => {
    if (!records) return [];
    return records.map((r) => ({
      date: formatDate(r.date),
      precipitation: r.precipitation ?? 0,
    }));
  }, [records]);

  if (!chartData.length) return null;

  return (
    <section className="chart-section animate-fade-in" aria-label="14-day rainfall bar chart">
      <h2 className="section-title">📊 14-Day Precipitation Chart</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit=" mm"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="precipitation" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.precipitation)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { color: '#334155', label: 'No Rain' },
          { color: '#34d399', label: 'Light (< 7.5 mm)' },
          { color: '#fbbf24', label: 'Moderate (7.5–35.5 mm)' },
          { color: '#f87171', label: 'Heavy (> 35.5 mm)' },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
