import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onTabChange }) {
  const tabs = [
    'dashboard', 'riders', 'drivers', 'trips', 'manual-ride',
    'vehicle-type', 'earning-reports', 'review-ratings', 'gods-view',
    'statement', 'promo-code', 'push-notifications', 'site-setting', 'pages'
  ];

  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (tab) => {
    if (tab === 'drivers') {
      setActiveTab((prevTab) => (prevTab === 'drivers' ? null : 'drivers'));  // Toggle tab con
    } else {
      setActiveTab(null);  // Khi chọn tab khác, ẩn options của drivers
    }
    onTabChange(tab);
  };

  return (
    <nav className="sidebar">
      <ul>
        {tabs.map((tab) => (
          <React.Fragment key={tab}>
            <li>
              <a href="#" onClick={() => handleTabClick(tab)}>
                {tab.replace(/-/g, ' ')}
              </a>
            </li>
            
            {/* Hiển thị các options con ngay dưới tab "drivers" */}
            {tab === 'drivers' && activeTab === 'drivers' && (
              <ul className="sub-menu">
                <li>
                  <a href="#" onClick={() => onTabChange('approvedDrivers')}>
                    Drivers
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => onTabChange('unapprovedDrivers')}>
                    Un-approved Drivers
                  </a>
                </li>
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;


