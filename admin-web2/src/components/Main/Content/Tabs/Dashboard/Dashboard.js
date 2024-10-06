import './Dashboard.css';
// import sub-components
import StatCards from './cards/StatCard'; // Statistics Cards
import RideChart from './charts/RideChart'; // Rides Statistic
import DriverChart from './charts/DriverChart' // Drivers Statistic
import RecentRide from './tables/RecentRide'; // Recent Ride


// import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import zoomPlugin from 'chartjs-plugin-zoom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
// import { faCar, faFlagCheckered, faMoneyBillTrendUp, faPersonRunning, faRectangleXmark, faRoad, faUserAstronaut, faUsersLine } from '@fortawesome/free-solid-svg-icons'; // Import faMapMarkerAlt
// import ChartDataLabels from 'chartjs-plugin-datalabels'
// // import axios from 'axios'
// import 'chart.js/auto'

// // Đăng ký các thành phần của Chart.js
// ChartJS.register(Title, Tooltip, Legend, ChartDataLabels, LineElement, ArcElement, BarElement, CategoryScale, LinearScale, zoomPlugin);  // Đăng ký các thành phần cần thiết

const Dashboard = () => {

  return (
    <div className="dashboard">
      {/* Phần 1: Các thẻ thống kê */}
      <StatCards />

      {/* Phần 2: Biểu đồ */}
      <div className="charts-section">
        {/* Rides Statistic */}
        <RideChart />
        {/* Drivers Statistic */}
        <DriverChart />
      </div>

      {/* Phần 3: Bảng Recent Rides */}
      <RecentRide />
    </div>
  );
}

export default Dashboard;
