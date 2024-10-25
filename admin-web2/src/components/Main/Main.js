import React, { useState } from 'react';
import Sidebar from './SideBar/Sidebar';
import Content from './Content/Content';
import './Main.css';

function Main() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [subPage, setSubPage] = useState(null); // Quản lý trang phụ (subpage) như RideHistory hay RiderStatus
  const [isCollapsed, setIsCollapsed] = useState(false); // thoe dõi trạng thái sideBar
  const [fadeContent, setFadeContent] = useState(false);

  const handleTabChange = (tab) => {
    setFadeContent(true); // bắt hiệu ứng mờ dần
    setTimeout(() => {
      setActiveTab(tab);
      setSubPage(null); // Reset trang phụ khi chuyển tab
      setFadeContent(false);
    }, 400);
  };

  const handleSubPageChange = (page, data) => {
    setSubPage({ page, data }); // Lưu trang phụ và dữ liệu cần thiết
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="main">
      <Sidebar onTabChange={handleTabChange} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}/>
      <Content activeTab={activeTab} subPage={subPage} onSubPageChange={handleSubPageChange} isCollapsed={isCollapsed} fadeContent={fadeContent}/>
    </div>
  );
}

export default Main;
