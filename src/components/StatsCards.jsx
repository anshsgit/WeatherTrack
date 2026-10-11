/**
 * StatsCards.jsx
 * Displays computed summary statistics as visual metric cards.
 * Demonstrates: props, useMemo (computed in parent), conditional rendering.
 */
import React from 'react';
import {
  WiRaindrop,
  WiDaySunny,
  WiStormShowers,
  WiRain,
} from 'react-icons/wi';
import { formatDate } from '../utils/weatherUtils';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const { total, average, maxDay, rainyDays } = stats;

  const cards = [
    {
      id: 'stat-total',
      label: 'Total Rainfall',
      value: `${total} mm`,
      icon: <WiRaindrop size={22} />,
      colorClass: 'blue',
    },
    {
      id: 'stat-average',
      label: 'Daily Average',
      value: `${average} mm`,
      icon: <WiRain size={22} />,
      colorClass: 'cyan',
    },
    {
      id: 'stat-max',
      label: 'Peak Rainfall Day',
      value: maxDay ? `${maxDay.precipitation} mm` : 'N/A',
      subLabel: maxDay ? formatDate(maxDay.date) : '',
      icon: <WiStormShowers size={22} />,
      colorClass: 'violet',
    },
    {
      id: 'stat-rainy-days',
      label: 'Rainy Days',
      value: `${rainyDays} / 14`,
      icon: <WiDaySunny size={22} />,
      colorClass: 'emerald',
    },
  ];

  return (
    <div className="stats-grid" role="region" aria-label="Rainfall statistics summary">
      {cards.map(({ id, label, value, subLabel, icon, colorClass }) => (
        <article key={id} id={id} className={`stat-card ${colorClass}`}>
          <div className={`stat-icon ${colorClass}`} aria-hidden="true">
            {icon}
          </div>
          <div className="stat-value">{value}</div>
          {subLabel && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-4px' }}>
              {subLabel}
            </div>
          )}
          <div className="stat-label">{label}</div>
        </article>
      ))}
    </div>
  );
}
