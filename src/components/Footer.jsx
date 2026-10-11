/**
 * Footer.jsx
 * Simple, consistent footer shown across all pages.
 */
import React from 'react';
import { WiRaindrop } from 'react-icons/wi';
import '../styles/Pages.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
          <WiRaindrop color="var(--color-accent-blue)" size={18} aria-hidden="true" />
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>WeatherTrack</span>
        </div>
        <p>
          &copy; {year} Ansh Gupta &nbsp;|&nbsp; PRN: 125M1H004 &nbsp;|&nbsp; Advanced Web Technologies — FA-2
        </p>
        <p style={{ marginTop: 4 }}>
          Data powered by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
            Open-Meteo API
          </a>{' '}
          &nbsp;&mdash;&nbsp; Free, open-source weather data
        </p>
      </div>
    </footer>
  );
}
