import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/users', label: 'User Management' },
  { path: '/reports', label: 'Reports' },
  { path: '/settings', label: 'Settings' }
];

const Navigation: React.FC = () => (
  <nav className="sidebar">
    <div className="sidebar__branding">Admin Analytics</div>
    <ul className="sidebar__list">
      {navItems.map((item) => (
        <li key={item.path}>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={item.path}>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default Navigation;
