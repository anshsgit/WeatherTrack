/**
 * HomePage.jsx
 * Landing page with hero section and feature highlights.
 * Demonstrates: React Router Link, JSX, animation classes, semantic HTML.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { RiLineChartLine } from 'react-icons/ri';
import { WiRaindrop } from 'react-icons/wi';
import '../styles/Pages.css';



export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          <div className="hero-badge">
            <WiRaindrop size={16} aria-hidden="true" />
            Advanced Web Technologies — FA-2 Project
          </div>

          <h1 id="hero-title" className="hero-title">
            Track Weather,{' '}
            <span className="gradient-text">Understand Climate</span>
          </h1>

          <p className="hero-subtitle">
            WeatherTrack delivers 14-day historical rainfall data for any city in
            the world. Built with React Hooks, React Router, Recharts, and the
            free Open-Meteo API.
          </p>

          <div className="hero-cta">
            <Link id="hero-cta-dashboard" to="/dashboard" className="btn btn-primary">
              <RiLineChartLine aria-hidden="true" />
              Open Dashboard
            </Link>
            <Link id="hero-cta-about" to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
