import React, { act } from 'react';
import Dashboard from './Tabs/Dashboard/Dashboard';
import './Content.css';
// Riders
import Rider from './Tabs/Riders/Rider';

// Drivers
import DriverList from './Tabs/Drivers/ApprovedDrivers/DriverList';
import DriverStatement from './Tabs/Drivers/ApprovedDrivers/ColOtherAction/DriverStatement'

// Common component
import CommonAdd from './Tabs/Riders/AddRider/CommonAdd';
import CommonRideHistory from './Tabs/Riders/ColState/CommonRiderHistory';
import CommonStatus from './Tabs/Riders/ColState/RiderStatus';
import CommonEdit from './Tabs/Riders/ColAction/CommonEdit';
import VehicleType from './Tabs/VehicleType/VehicleType';
import AddVehicleType from './Tabs/VehicleType/VehicleAction/AddVehicleType';
import EditVehicleType from './Tabs/VehicleType/VehicleAction/EditVehicleType';

const apiUrlDrivers = 'http://localhost:8080/trips/drivers'
const apiUrlRiders = 'http://localhost:8080/trips/riders'


function Content({ activeTab, subPage, onSubPageChange }) {
  const renderContent = () => {
    // console.log('Active tab is: ', activeTab);

    if (subPage) {
      switch (subPage.page) {
        // Riders
        case 'addRider':
          return <CommonAdd
            title='Rider Add'
            apiUrl={apiUrlRiders}
            onSubPageChange={onSubPageChange}
          />;
        case 'rideHistory':
          return <CommonRideHistory
            title='Rider History'
            apiUrl={apiUrlRiders}
            historyId={subPage.data.riderId}
            onSubPageChange={onSubPageChange}
          />
        case 'riderStatus':
          return <CommonStatus
            title='Riders Status'
            apiUrl={apiUrlRiders}
            statusId={subPage.data.riderId}
            status={subPage.data.status}
            onSubPageChange={onSubPageChange}
          />
        case 'editRider':
          return <CommonEdit
            title='Rider Edit'
            apiUrl={apiUrlRiders}
            editId={subPage.data.riderId}
            onSubPageChange={onSubPageChange}
          />;

        // Drivers
        case 'addDriver':
          return <CommonAdd
            title='Driver Add'
            apiUrl={apiUrlDrivers}
            onSubPageChange={onSubPageChange}
          />;
        case 'driverStatus':
          return <CommonStatus
            title='Driver Status'
            apiUrl={apiUrlDrivers}
            statusId={subPage.data.driverId}
            status={subPage.data.status}
            onSubPageChange={onSubPageChange}
          />
        case 'driverHistory':
          return <CommonRideHistory
            title='Driver History'
            apiUrl={apiUrlDrivers}
            historyId={subPage.data.driverId}
            onSubPageChange={onSubPageChange}
          />;
        case 'driverStatement':
          return <DriverStatement driverId={subPage.data.driverId} onSubPageChange={onSubPageChange} />;
        case 'driverEdit':
          return <CommonEdit
            title='Driver Edit'
            apiUrl={apiUrlDrivers}
            editId={subPage.data.driverId}
            onSubPageChange={onSubPageChange}
          />;

        // Vehicle
        case 'addVehicleType':
          return <AddVehicleType onSubPageChange={onSubPageChange}/>;
        case 'editVehicleType':
          return <EditVehicleType vehicleId={subPage.data.vehicleId} onSubPageChange={onSubPageChange} />;


        default:
          switch (activeTab) {
            case 'dashboard':
              return <Dashboard />;
            case 'riders':
              return <Rider onSubPageChange={onSubPageChange} />;
            case 'approvedDrivers':
              return <DriverList
                title="Drivers"
                apiUrl={apiUrlDrivers}
                showOnlineOffline={true}
                showOtherAction={true}
                onSubPageChange={onSubPageChange}
              />;  // Hiển thị danh sách Drivers đã được phê duyệt
            case 'unapprovedDrivers':
              return <DriverList
                title="Un-approved Drivers"
                apiUrl='http://localhost:8080/trips/drivers/un-approved'
                showOnlineOffline={false}
                showOtherAction={false}
                onSubPageChange={onSubPageChange}
              />;  // Hiển thị danh sách Drivers chưa được phê duyệt
            case 'vehicle-type':
              return <VehicleType onSubPageChange={onSubPageChange} />;
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
        return <DriverList
          title="Drivers"
          apiUrl={apiUrlDrivers}
          showOnlineOffline={true}
          showOtherAction={true}
          onSubPageChange={onSubPageChange}
        />;  // Hiển thị danh sách Drivers đã được phê duyệt
      case 'unapprovedDrivers':
        return <DriverList
          title="Un-approved Drivers"
          apiUrl='http://localhost:8080/trips/drivers/un-approved'
          showOnlineOffline={false}
          showOtherAction={false}
          onSubPageChange={onSubPageChange}
        />;  // Hiển thị danh sách Drivers chưa được phê duyệt
      case 'vehicle-type':
        return <VehicleType onSubPageChange={onSubPageChange} />;
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
