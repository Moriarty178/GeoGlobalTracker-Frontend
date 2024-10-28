import React from 'react';
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

// Vehicle Type
import VehicleType from './Tabs/VehicleType/VehicleType';
import AddVehicleType from './Tabs/VehicleType/VehicleAction/AddVehicleType';
import EditVehicleType from './Tabs/VehicleType/VehicleAction/EditVehicleType';

// Earning Reports
import AdminEarningReports from './Tabs/EarningReports/AdminEarningReports';
import DriverPaymentReports from './Tabs/EarningReports/DriverPaymentReports';

// Review & Ratings
import ReviewRating from './Tabs/ReviewRating/ReviewRating';

// God's View
import GodsView from './Tabs/GodView/GodsView';
import PromoCode from './Tabs/PromoCode/PromoCode';

// Promo Code
import AddPromoCode from './Tabs/PromoCode/AddPromoCode/AddPromoCode';
import EditPromoCode from './Tabs/PromoCode/AddPromoCode/EditPromoCode';
import { PushNotification } from './Tabs/PushNotification/PushNotification';
import OverallStatemnent from './Tabs/Statement/OverallStatement';
import TodayStatement from './Tabs/Statement/TodayStatement';
import YearlyStatement from './Tabs/Statement/YearlyStatement';

const apiUrlDrivers = 'http://localhost:8080/trips/drivers'
const apiUrlRiders = 'http://localhost:8080/trips/riders'


function Content({ activeTab, subPage, onSubPageChange, isCollapsed, fadeContent }) {
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
          return <DriverStatement
            urlStats={`http://localhost:8080/trips/drivers/stats/${subPage.data.driverId}`}
            urlApiHistory={`http://localhost:8080/trips/drivers/history/${subPage.data.driverId}`}
            // driverId={subPage.data.driverId}
            onSubPageChange={onSubPageChange}
          />;
        case 'driverEdit':
          return <CommonEdit
            title='Driver Edit'
            apiUrl={apiUrlDrivers}
            editId={subPage.data.driverId}
            onSubPageChange={onSubPageChange}
          />;

        // Vehicle
        case 'addVehicleType':
          return <AddVehicleType onSubPageChange={onSubPageChange} />;
        case 'editVehicleType':
          return <EditVehicleType vehicleId={subPage.data.vehicleId} onSubPageChange={onSubPageChange} />;

        // Promo Code
        case 'addPromoCode':
          return <AddPromoCode onSubPageChange={onSubPageChange} />;
        case 'editPromoCode':
          return <EditPromoCode promoId={subPage.data.promoId} onSubPageChange={onSubPageChange} />;

        default:
          switch (activeTab) {
            case 'Dashboard':
              return <Dashboard />;
            case 'Riders':
              return <Rider onSubPageChange={onSubPageChange} />;
            case 'ApprovedDrivers':
              return <DriverList
                title="Drivers"
                apiUrl={apiUrlDrivers}
                showOnlineOffline={true}
                showOtherAction={true}
                onSubPageChange={onSubPageChange}
              />;
            case 'UnapprovedDrivers':
              return <DriverList
                title="Un-approved Drivers"
                apiUrl={apiUrlDrivers + '/un-approved'}
                showOnlineOffline={false}
                showOtherAction={false}
                onSubPageChange={onSubPageChange}
              />;
            case 'Vehicle-type':
              return <VehicleType onSubPageChange={onSubPageChange} />;
            case 'Promo-code':
              return <PromoCode onSubPageChange={onSubPageChange} />;
            // Thêm các trường hợp khác
            default:
              return <h2>Welcome to Admin Dashboard</h2>;
          }
      }
    }

    // Nếu không có subPage (trang phụ), render tab chính
    // Xử lý tab chính
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Riders':
        return <Rider onSubPageChange={onSubPageChange} />;
      case 'ApprovedDrivers':
        return <DriverList
          title="Drivers"
          apiUrl={apiUrlDrivers}
          showOnlineOffline={true}
          showOtherAction={true}
          onSubPageChange={onSubPageChange}
        />;
      case 'UnapprovedDrivers':
        return <DriverList
          title="Un-approved Drivers"
          apiUrl={apiUrlDrivers + '/un-approved'}
          showOnlineOffline={false}
          showOtherAction={false}
          onSubPageChange={onSubPageChange}
        />;
      case 'Vehicle-type':
        return <VehicleType onSubPageChange={onSubPageChange} />;
      case 'Admin Earning Reports':
        return <AdminEarningReports onSubPageChange={onSubPageChange} />;
      case 'Driver Payment Reports':
        return <DriverPaymentReports onSubPageChange={onSubPageChange} />;
      case 'Review-ratings':
        return <ReviewRating onSubPageChange={onSubPageChange} />;
      case 'Gods-view':
        return <GodsView />;
      case 'Promo-code':
        return <PromoCode onSubPageChange={onSubPageChange} />;
      case 'Push-notifications':
        return <PushNotification />;

      // Statement
      case 'Overall Ride Statement':
        return <OverallStatemnent onSubPageChange={onSubPageChange}/>;
      case 'Today Ride Statement':
        return <TodayStatement onSubPageChange={onSubPageChange}/>;
      case 'Yearly Ride Statement':
        return <YearlyStatement onSubPageChange={onSubPageChange}/>;
      // Thêm các trường hợp khác
      default:
        return <h2>Welcome to Admin Dashboard</h2>;
    }
  };

  return (
    <section className={`content ${isCollapsed ? 'collapsed' : ''} ${fadeContent ? 'content-hidden' : ''}`}>
      <div id="content-display">
        {renderContent()}
      </div>
    </section>
  );
}

export default Content;
