import React, { useState } from 'react';
import Sidebar from './SideBar/Sidebar';
import Content from './Content/Content';
import './Main.css';

function Main() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subPage, setSubPage] = useState(null); // Quản lý trang phụ (subpage) như RideHistory hay RiderStatus

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSubPage(null); // Reset trang phụ khi chuyển tab
  };

  const handleSubPageChange = (page, data) => {
    setSubPage({ page, data }); // Lưu trang phụ và dữ liệu cần thiết
  };

  return (
    <div className="main">
      <Sidebar onTabChange={handleTabChange} />
      <Content activeTab={activeTab} subPage={subPage} onSubPageChange={handleSubPageChange} />
    </div>
  );
}

export default Main;
