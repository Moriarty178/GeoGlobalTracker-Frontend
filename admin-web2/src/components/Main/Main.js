import React, { useState } from 'react';
import Sidebar from './SideBar/Sidebar';
import Content from './Content/Content';
import './Main.css';

function Main() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="main">
      <Sidebar onTabChange={handleTabChange} />
      <Content activeTab={activeTab} />
    </div>
  );
}

export default Main;
