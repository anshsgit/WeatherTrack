/**
 * AboutPage.jsx
 * Project documentation page — describes tech stack, features, and student details.
 */
import React from 'react';
import {
  RiReactjsLine,
  RiGitBranchLine,
  RiCodeSSlashLine,
  RiTestTubeLine,
  RiSmartphoneLine,
  RiCloudLine,
} from 'react-icons/ri';
import '../styles/Pages.css';

const TECH_STACK = [
  { icon: <RiReactjsLine />, name: 'React 19', desc: 'UI Library' },
  { icon: <RiGitBranchLine />, name: 'React Router v7', desc: 'Client Routing' },
  { icon: <RiCodeSSlashLine />, name: 'Recharts', desc: 'Data Visualisation' },
  { icon: <RiCloudLine />, name: 'Open-Meteo API', desc: 'Weather Data' },
  { icon: <RiTestTubeLine />, name: 'Vitest', desc: 'Unit Testing' },
  { icon: <RiSmartphoneLine />, name: 'Vanilla CSS', desc: 'Responsive Styles' },
];


export default function AboutPage() {
  return (
    <main className="page-wrapper route-transition">
      <div className="container">
        <div className="about-section">
          {/* Page Title */}
          <header className="page-header">
            <h1>About WeatherTrack</h1>
            <p>
              A full-featured weather and climate tracking application developed as
              part of the Advanced Web Technologies (AWT) course — Formative Assessment 2.
            </p>
          </header>

          {/* Student Info Card */}
          <div
            className="card animate-fade-in"
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
              Student Details
            </h2>
            <table className="student-details-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <tbody>
                {[
                  ['Name', 'Ansh Gupta'],
                  ['PRN', '125M1H004'],
                  ['Course', 'SYMCA — Advanced Web Technologies'],
                  ['Assessment', 'Formative Assessment 2 (FA-2)'],
                  ['Project Title', 'WeatherTrack — Climate Intelligence Dashboard'],
                  ['API Source', 'Open-Meteo (open-meteo.com)'],
                ].map(([key, val]) => (
                  <tr key={key}>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)', width: '40%', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {key}
                    </td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text-primary)' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tech Stack */}
          <h2>Technology Stack</h2>
          <div className="tech-stack-grid">
            {TECH_STACK.map(({ icon, name, desc }) => (
              <div key={name} className="tech-badge">
                <span style={{ fontSize: '1.1rem', color: 'var(--color-accent-blue)' }} aria-hidden="true">
                  {icon}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
