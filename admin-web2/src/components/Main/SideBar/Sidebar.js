import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ onTabChange, isCollapsed, toggleSidebar }) {
  // Cấu trúc đối tượng chứa các tab và sub-menu
  const tabs = {
    'Dashboard': null,
    'Riders': null,
    'Drivers': ['ApprovedDrivers', 'UnapprovedDrivers'],
    'Vehicle-type': null,
    'Earning-reports': ['Admin Earning Reports', 'Driver Payment Reports'],
    'Review-ratings': null,
    'Gods-view': null,
    'Manual-ride': null,
    'Trips': null,
    'Statement': null,
    'Promo-code': null,
    'Push-notifications': null,
    'Site-setting': null,
    'Pages': null
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
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {!isCollapsed && (
        <ul>
          {Object.keys(tabs).map((tab) => (
            <React.Fragment key={tab}>
              <li>
                <a href="#" onClick={() => handleTabClick(tab)}>
                  {tab.replace(/-/g, ' ')}
                </a>
              </li>
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
      )}
      <button className="collapse-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isCollapsed ? faExpand : faCompress}/>
      </button>
    </nav>
  );
}

export default Sidebar;