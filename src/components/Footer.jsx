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
        <p className="footer-copy">
          <span>&copy; {year} Ansh Gupta</span>
          <span className="footer-sep">|</span>
          <span>PRN: 125M1H004</span>
          <span className="footer-sep">|</span>
          <span>Advanced Web Technologies — FA-2</span>
        </p>
        <p className="footer-credits">
          Data powered by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
            Open-Meteo API
          </a>{' '}
          — Free, open-source weather data
        </p>
      </div>
    </footer>
  );
}
