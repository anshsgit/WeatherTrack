/**
 * Navbar.jsx
 * Sticky navigation bar with React Router NavLink for active-link highlighting.
 * Responsive: hamburger menu on mobile screens.
 * Demonstrates: useState (menu open/close), NavLink, useLocation.
 */
import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  WiRaindrop,
  WiDaySunny,
} from 'react-icons/wi';
import {
  RiHomeLine,
  RiDashboardLine,
  RiHeartLine,
  RiInformationLine,
  RiMenuLine,
  RiCloseLine,
} from 'react-icons/ri';
import '../styles/Navbar.css';

const NAV_ITEMS = [
  { to: '/',          label: 'Home',      icon: <RiHomeLine /> },
  { to: '/dashboard', label: 'Dashboard', icon: <RiDashboardLine /> },
  { to: '/favourites', label: 'Favourites', icon: <RiHeartLine /> },
  { to: '/about',     label: 'About',     icon: <RiInformationLine /> },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand" onClick={closeMenu} aria-label="WeatherTrack Home">
          <div className="navbar-brand-icon" aria-hidden="true">
            <WiRaindrop color="#fff" size={20} />
          </div>
          <span className="navbar-brand-text">
            Weather<span>Track</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="navbar-links" role="list">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                aria-label={label}
              >
                <span aria-hidden="true">{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          id="nav-hamburger-btn"
          className="navbar-hamburger"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-drawer"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <ul
        id="nav-mobile-drawer"
        className={`navbar-drawer${menuOpen ? ' open' : ''}`}
        role="list"
      >
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={closeMenu}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
