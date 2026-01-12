import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="navigation-header">
        <h2>Admin Platform</h2>
      </div>
      <ul className="navigation-menu">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
          >
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
          >
            👥 Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
          >
            📈 Reports
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
          >
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
