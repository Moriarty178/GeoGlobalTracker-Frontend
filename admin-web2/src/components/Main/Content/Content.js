import React, { act } from 'react';
import Dashboard from './Tabs/Dashboard/Dashboard';
import './Content.css';
import Rider from './Tabs/Riders/Rider';
import RideHistory from './Tabs/Riders/ColState/RiderHistory';
import RiderStatus from './Tabs/Riders/ColState/RiderStatus';
import RiderAdd from './Tabs/Riders/AddRider/RiderAdd';
import RiderEdit from './Tabs/Riders/ColAction/RiderEdit';

function Content({ activeTab, subPage, onSubPageChange }) {
  const renderContent = () => {
    if (subPage) {
      switch (subPage.page) {
        case 'rideHistory':
          return <RideHistory riderId={subPage.data.riderId} onSubPageChange={onSubPageChange} />
        case 'riderStatus':
          return <RiderStatus riderId={subPage.data.riderId} status={subPage.data.status} onSubPageChange={onSubPageChange} />
        case 'addRider':
          return <RiderAdd onSubPageChange={onSubPageChange} />;
        case 'editRider':
          return <RiderEdit riderId={subPage.data.riderId} onSubPageChange={onSubPageChange} />;
        default:
          switch (activeTab) {
            case 'dashboard':
              return <Dashboard />;
            case 'riders':
              return <Rider onSubPageChange={onSubPageChange} />;
            case 'drivers':
              return <h2>Drivers</h2>;
            case 'trips':
              return <h2>Trips</h2>;
            // Thêm các trường hợp khác cho các tab...
            default:
              return <h2>Welcome to Admin Dashboard</h2>;
          }
      }
    }

    // Nếu không có subPage (trang phụ), render tab chính
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'riders':
        return <Rider onSubPageChange={onSubPageChange} />;
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
