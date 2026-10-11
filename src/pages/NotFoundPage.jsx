/**
 * NotFoundPage.jsx
 * 404 fallback route — shown when no route matches.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import '../styles/Pages.css';

export default function NotFoundPage() {
  return (
    <main>
      <div className="error-page route-transition" role="main">
        <div className="error-page-code" aria-hidden="true">404</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 400, marginBottom: '2rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>
        <Link id="not-found-home-link" to="/" className="btn btn-primary">
          <RiArrowLeftLine aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
