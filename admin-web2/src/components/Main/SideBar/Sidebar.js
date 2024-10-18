import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onTabChange }) {
  // Cấu trúc đối tượng chứa các tab và sub-menu
  const tabs = {
    'dashboard': null,
    'riders': null,
    'drivers': ['approvedDrivers', 'unapprovedDrivers'],
    'vehicle-type': null,
    'earning-reports': ['Admin Earning Reports', 'Driver Payment Reports'],
    'review-ratings': null,
    'gods-view': null,
    'manual-ride': null,
    'trips': null,
    'statement': null,
    'promo-code': null,
    'push-notifications': null,
    'site-setting': null,
    'pages': null
  };

  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (tab) => {
    if (tabs[tab]) {
      // Nếu tab có sub-menu, thì toggle sub-menu
      setActiveTab((prevTab) => (prevTab === tab ? null : tab));
    } else {
      setActiveTab(null); // Ẩn sub-menu khi bấm vào tab không có sub-menu
      onTabChange(tab); // Chuyển đổi trực tiếp tab nếu không có sub-menu
    }
  };

  return (
    <nav className="sidebar">
      <ul>
        {Object.keys(tabs).map((tab) => (
          <React.Fragment key={tab}>
            <li>
              <a href="#" onClick={() => handleTabClick(tab)}>
                {tab.replace(/-/g, ' ')}
              </a>
            </li>

            {/* Hiển thị sub-menu nếu tab có sub-menu và đang được mở */}
            {tabs[tab] && activeTab === tab && (
              <ul className="sub-menu">
                {tabs[tab].map((subTab) => (
                  <li key={subTab}>
                    <a href="#" onClick={() => onTabChange(subTab)}>
                      {subTab}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
