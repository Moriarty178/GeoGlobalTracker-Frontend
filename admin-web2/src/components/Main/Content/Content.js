import React, { act } from 'react';
import Dashboard from './Tabs/Dashboard/Dashboard';
import './Content.css';
// Riders
import Rider from './Tabs/Riders/Rider';
import RideHistory from './Tabs/Riders/ColState/RiderHistory';
import RiderStatus from './Tabs/Riders/ColState/RiderStatus';
import RiderAdd from './Tabs/Riders/AddRider/RiderAdd';
import RiderEdit from './Tabs/Riders/ColAction/RiderEdit';

// Drivers
import ApprovedDrivers from './Tabs/Drivers/ApprovedDrivers/ApprovedDrivers';
import UnapprovedDrivers from './Tabs/Drivers/UnApprovedDrivers/UnapprovedDrivers';
import DriverAdd from './Tabs/Drivers/ApprovedDrivers/AddDriver/DriverAdd'
import DriverStatus from './Tabs/Drivers/ApprovedDrivers/ColStatus/DriverStatus'
import RideHistoryOfDriver from './Tabs/Drivers/ApprovedDrivers/ColOtherAction/RideHistoryOfDriver'
import DriverStatement from './Tabs/Drivers/ApprovedDrivers/ColOtherAction/DriverStatement'
import DriverEdit from './Tabs/Drivers/ApprovedDrivers/ColAction/DriverEdit';


function Content({ activeTab, subPage, onSubPageChange }) {
  const renderContent = () => {
    // console.log('Active tab is: ', activeTab);

    if (subPage) {
      switch (subPage.page) {
        // Riders
        case 'addRider':
          return <RiderAdd onSubPageChange={onSubPageChange} />;
        case 'rideHistory':
          return <RideHistory riderId={subPage.data.riderId} onSubPageChange={onSubPageChange} />
        case 'riderStatus':
          return <RiderStatus riderId={subPage.data.riderId} status={subPage.data.status} onSubPageChange={onSubPageChange} />
        case 'editRider':
          return <RiderEdit riderId={subPage.data.riderId} onSubPageChange={onSubPageChange} />;

        // Drivers
        case 'addDriver':
          return <DriverAdd onSubPageChange={onSubPageChange} />;
        case 'driverStatus':
          return <DriverStatus driverId={subPage.data.driverId} status={subPage.data.status} onSubPageChange={onSubPageChange} />
        case 'driverHistory':
          return <RideHistoryOfDriver driverId={subPage.data.driverId} onSubPageChange={onSubPageChange} />;
        case 'driverStatement':
          return <DriverStatement driverId={subPage.data.driverId} onSubPageChange={onSubPageChange} />;
        case 'driverEdit':
          return <DriverEdit driverId={subPage.data.driverId} onSubPageChange={onSubPageChange} />;


        default:
          switch (activeTab) {
            case 'dashboard':
              return <Dashboard />;
            case 'riders':
              return <Rider onSubPageChange={onSubPageChange} />;
            case 'approvedDrivers':
              return <ApprovedDrivers onSubPageChange={onSubPageChange} />;  // Hiển thị danh sách Drivers đã được phê duyệt
            case 'unapprovedDrivers':
              return <UnapprovedDrivers onSubPageChange={onSubPageChange} />;  // Hiển thị danh sách Drivers chưa được phê duyệt
            case 'trips':
              return <h2>Trips</h2>;
            // Thêm các trường hợp khác
            default:
              return <h2>Welcome to Admin Dashboard</h2>;
          }
      }
    }

    // Nếu không có subPage (trang phụ), render tab chính
    // Xử lý tab chính
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'riders':
        return <Rider onSubPageChange={onSubPageChange} />;
      case 'approvedDrivers':
        return <ApprovedDrivers onSubPageChange={onSubPageChange} />;  // Hiển thị danh sách Drivers đã được phê duyệt
      case 'unapprovedDrivers':
        return <UnapprovedDrivers onSubPageChange={onSubPageChange} />;  // Hiển thị danh sách Drivers chưa được phê duyệt
      case 'trips':
        return <h2>Trips</h2>;
      // Thêm các trường hợp khác
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
