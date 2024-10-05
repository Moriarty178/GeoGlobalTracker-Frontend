import React from 'react';
import './Sidebar.css';

function Sidebar({ onTabChange }) {
  const tabs = [
    'dashboard', 'riders', 'drivers', 'trips', 'manual-ride',
    'vehicle-type', 'earning-reports', 'review-ratings', 'gods-view',
    'statement', 'promo-code', 'push-notifications', 'site-setting', 'pages'
  ];

  return (
    <nav className="sidebar">
      <ul>
        {tabs.map((tab) => (
          <li key={tab}>
            <a href="#" onClick={() => onTabChange(tab)}>
              {tab.replace(/-/g, ' ')}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
