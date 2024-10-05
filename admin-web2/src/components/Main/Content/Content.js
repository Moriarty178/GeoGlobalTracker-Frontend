import React from 'react';
import Dashboard from './Tabs/Dashboard/Dashboard';
import './Content.css';

function Content({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'riders':
        return <h2>Riders</h2>;
      case 'drivers':
        return <h2>Drivers</h2>;
      case 'trips':
        return <h2>Trips</h2>;
      // Thêm các trường hợp khác cho các tab...
      default:
        return <h2>Welcome to Admin Dashboard</h2>;
    }
  };

  return (
    <section className="content">
      <div id="content-display">
        {renderContent()}
      </div>
    </section>
  );
}

export default Content;
