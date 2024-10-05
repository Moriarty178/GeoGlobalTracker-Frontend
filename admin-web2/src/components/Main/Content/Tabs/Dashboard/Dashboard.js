import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import RideChart from './charts/RideChart'; // Rides Statistic
// import './charts/DriverChart'; // Drivers Statistic
import DriverChart from './charts/DriverChart'

import { Bar, Line, Doughnut } from 'react-chartjs-2'; // Giả sử bạn sẽ sử dụng chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faCar, faChartLine, faChartPie, faFlagCheckered, faMapMarkerAlt, faMoneyBillTrendUp, faPersonRunning, faRectangleXmark, faRemove, faRoad, faRunning, faUserAstronaut, faUsersLine } from '@fortawesome/free-solid-svg-icons'; // Import faMapMarkerAlt
import ChartDataLabels from 'chartjs-plugin-datalabels'
// import axios from 'axios'
import 'chart.js/auto'

// Đăng ký các thành phần của Chart.js
ChartJS.register(Title, Tooltip, Legend, ChartDataLabels, LineElement, ArcElement, BarElement, CategoryScale, LinearScale, zoomPlugin);  // Đăng ký các thành phần cần thiết

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRiders: 0,
    totalDrivers: 0,
    vehicleType: 0,
    revenue: 0,
    totalRides: 0,
    runningRides: 0,
    canceledRides: 0,
    completedRides: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
      })
      .catch((error) => console.error("Error fetching dashboard stats:", error));
  }, []);

  /*----------- Biểu đồ Rides Statistic ------------*/
  // const [weeklyDates, setWeeklyDates] = useState([]);

  // useEffect(() => {
  //   // Tạo danh sách ngày theo tuần cho trục hoành
  //   const generateWeeklyDates = () => {
  //     const today = new Date();
  //     const weeks = Array.from({ length: 12 }, (_, index) => {
  //       const date = new Date(today);
  //       date.setDate(today.getDate() - index * 7); // Giảm ngày theo từng tuần
  //       return format(date, 'yyyy-MM-dd'); // Định dạng ngày cho từng tuần
  //     }).reverse(); // Đảo ngược thứ tự tuần để tuần cũ ở trước

  //     setWeeklyDates(weeks);
  //   };

  //   generateWeeklyDates();
  // }, []);

  // // Dữ liệu cho biểu đồ rides
  // const rideStatusData = {
  //   labels: weeklyDates, // Nhãn cho từng tuần
  //   datasets: [
  //     {
  //       label: 'Running Rides',
  //       data: [10, 20, 15, 30, 5, 7, 10, 8, 7, 8, 9, 11, 10, 8, 5, 7], // Dữ liệu cho Running
  //       borderColor: 'rgba(54, 162, 235, 1)',
  //       backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //       fill: true,
  //       tension: 0.4, // Độ cong của đường
  //     },
  //     {
  //       label: 'Canceled Rides',
  //       data: [5, 7, 10, 8, 5, 7, 10, 8, 5, 7, 10, 8, 10, 8, 5, 7], // Dữ liệu cho Canceled
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       fill: true,
  //       tension: 0.4,
  //     },
  //     {
  //       label: 'Completed Rides',
  //       data: [30, 40, 35, 50, 15, 27, 37, 45, 60, 75, 80, 95, 10, 8, 5, 7], // Dữ liệu cho Completed
  //       borderColor: 'rgba(75, 192, 192, 1)',
  //       backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // // Cấu hình cho biểu đồ với tính năng cuộn và zoom
  // const options2 = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Ride Status by Week',
  //       font: {
  //         size: 18,
  //       },
  //       padding: {
  //         top: 10,
  //         bottom: 20,
  //       },
  //     },
  //     tooltip: {
  //       mode: 'index',
  //       intersect: false, // Hiển thị tooltip cho tất cả các dataset tại cùng một điểm
  //     },
  //     zoom: {
  //       pan: {
  //         enabled: true,
  //         mode: 'x',
  //         rangeMin: {
  //           x: new Date('2024-07-30').getTime(), // Thời gian bắt đầu cho phép cuộn (ví dụ: 1/1/2023)
  //         },
  //         rangeMax: {
  //           x: new Date().getTime(), // Giới hạn cuộn đến thời gian hiện tại
  //         },
  //       },
  //       zoom: {
  //         enabled: true,
  //         mode: 'x',
  //       },
  //     },
  //   },
  //   scales: {
  //     x: {
  //       type: 'time',
  //       time: {
  //         unit: 'week', // Đơn vị thời gian là tuần
  //       },
  //       min: weeklyDates[weeklyDates.length - 12], // Hiển thị 12 tuần gần nhất
  //       max: weeklyDates[weeklyDates.length - 1],
  //       ticks: {
  //         maxTicksLimit: 12, // Số lượng nhãn tối đa hiển thị trên trục x
  //       },
  //       title: {
  //         display: true,
  //         text: 'Week',
  //       },
  //     },
  //     y: {
  //       beginAtZero: true,
  //       title: {
  //         display: true,
  //         text: 'Number of Rides',
  //       },
  //     },
  //   },
  //   animation: {
  //     duration: 500, // Thời gian chuyển đổi khi cuộn hoặc zoom
  //     easing: 'easeInOutQuad', // Hiệu ứng easing để làm mượt quá trình
  //   },
  // };

  /*----------- Drivers Statistics -----------*/
  // State để lưu trữ giá trị hiển thị ở giữa biểu đồ Doughnut
  // const [centerValue, setCenterValue] = useState('click a section');

  // // Dữ liệu Driver Statistic
  // const driverStatisticsData = {
  //   labels: ['Approved Drivers', 'Blocked Drivers', 'Pending Drivers'],
  //   datasets: [
  //     {
  //       label: 'Driver Statistics',
  //       data: [279, 143, 157],
  //       backgroundColor: ['blue', '#2dc71c', '#4695d4'],
  //       hoverOffset: 36,
  //     },
  //   ],
  // };

  // // Plugin để hiển thị giá trị ở giữa biểu đồ (drivers)
  // const centerTextPlugin = {
  //   id: 'centerText',
  //   beforeDraw: (chart) => {
  //     const { ctx, width, height } = chart;
  //     ctx.save();
  //     ctx.font = 'bold 24px Arial';
  //     ctx.textAlign = 'center';
  //     ctx.textBaseline = 'middle';
  //     ctx.fillStyle = '#000'; // Màu chữ

  //     // const text = centerValue; // sẽ ko cập nhật được khi centerValue thay đổi BỞI VI khi component re-renders,nó tạo ra context mới, -> nếu chỉ định centerValue trực tiếp thì nó sẽ KHÔNG CẬP NHẬT khi có thay đổi.
  //     // Lấy giá trị centerValue để tách dòn
  //     const centerValue = chart.options.plugins.centerTextPlugin.centerValue || 'click a section'; // Dùng getContext của chart để lấy giá tị mới nhất của centerValue
  //     const lines = centerValue.split('\n');

  //     const lineHeight = 30;
  //     const startY = height * 0.55; // Điều chỉnh vị trí khởi đầu y

  //     // Vẽ từng dòng
  //     lines.forEach((line, index) => {
  //       ctx.fillText(line, width / 2, startY + index * lineHeight); // Vẽ từng dòng
  //     });

  //     ctx.restore(); // Khôi phục trạng thái canvas
  //   },
  // };

  // // Options cho biểu đồ drivers
  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: `Total Drivers: ${stats.totalDrivers}`,
  //       font: {
  //         size: 18,
  //       },
  //       padding: {
  //         top: 10,
  //         bottom: 20,
  //       },
  //     },
  //     tooltip: {
  //       enabled: false,
  //     },
  //     datalabels: {
  //       display: false, // Ẩn giá trị trên từng phần của biểu đồ Doughnut
  //     },
  //     centerTextPlugin: {
  //       centerValue: centerValue // Ghi lại giá trị centerValue vào options
  //     },
  //   },
  //   onClick: (event, elements) => {
  //     if (elements.length > 0) {
  //       const clickedIndex = elements[0].index; // Lấy chỉ số phần tử được nhấn
  //       const label = driverStatisticsData.labels[clickedIndex]; // láy label tương ứng phần tử được click
  //       const count = driverStatisticsData.datasets[0].data[clickedIndex];
  //       setCenterValue(`${label}\n${count}`); // Cập nhật giá trị hiển thị
  //     }
  //   },
  // };

  // Dữ liệu mẫu cho bảng Recent Rides
  const recentRides = [
    {
      tripId: 'T001',
      customerName: 'John Doe',
      driverName: 'Jane Smith',
      pickupAddress: '123 Main St',
      dropAddress: '456 Oak St',
      date: '2024-10-01',
      fare: '$25.00',
      status: 'Completed',
    },
    {
      tripId: 'T002',
      customerName: 'Alice Johnson',
      driverName: 'Bob Williams',
      pickupAddress: '789 Pine St',
      dropAddress: '321 Maple St',
      date: '2024-10-01',
      fare: '$15.00',
      status: 'Canceled',
    },
    // Thêm các dòng khác tùy ý
  ];

  return (
    <div className="dashboard">
      {/* Phần 1: Các thẻ thống kê */}
      <div className="stats-cards">
        <div className="stats-left">
          <h3>Site Statistics</h3> {/* Tiêu đề cho nhóm thẻ thống kê */}
          <div className="stats-row">
            <div className="card" style={{ backgroundColor: '#4CAF50' }}>
              <div className='icon-container' style={{ backgroundColor: 'green' }}>
                <FontAwesomeIcon className='icon-config' icon={faUsersLine} style={{ color: '#0100f3' }} /> {/* Biểu tượng cho Total Riders */}
              </div>
              <div className='card-content'>
                <h4>Total Customers</h4>
                <span>{stats.totalRiders}</span>
              </div>
            </div>
            <div className="card" style={{ backgroundColor: '#2196F3' }}>
              <div className='icon-container' style={{ backgroundColor: '#2020eb' }}>
                <FontAwesomeIcon className='icon-config' icon={faUserAstronaut} style={{ color: '#00ffed' }} /> {/* Biểu tượng cho Total Drivers */}
              </div>
              <div className='card-content'>
                <h4>Total Drivers</h4>
                <span>{stats.totalDrivers}</span>
              </div>
            </div>
          </div>
          <div className="stats-row" >
            <div className="card" style={{ backgroundColor: '#FF9800' }}>
              <div className='icon-container' style={{ backgroundColor: '#c58002' }}>
                <FontAwesomeIcon className='icon-config' icon={faCar} style={{ color: '#b00808' }} /> {/* Biểu tượng cho Vehicle Type */}
              </div>
              <div className='card-content'>
                <h4>Vehicle Type</h4>
                <span>{stats.vehicleType}</span>
              </div>
            </div>
            <div className="card" style={{ backgroundColor: '#b70c8f' }}>
              <div className='icon-container' style={{ backgroundColor: '#8d016c' }}>
                <FontAwesomeIcon className='icon-config' icon={faMoneyBillTrendUp} style={{ color: 'green' }} /> {/* Biểu tượng cho Revenue */}
              </div>
              <div className='card-content'>
                <h4>Revenue</h4>
                <span>{stats.revenue}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="stats-right">
          <h3>Ride Statistics</h3> {/* Tiêu đề cho nhóm thẻ thống kê */}
          <div className="stats-row">
            <div className="card" style={{ backgroundColor: '#F44336' }}>
              <div className='icon-container' style={{ backgroundColor: '#3f3838' }}>
                <FontAwesomeIcon className='icon-config' icon={faRoad} style={{ color: 'white' }} /> {/* Biểu tượng cho Total Rides */}
              </div>
              <div className='card-content'>
                <h4>Total Rides</h4>
                <span>{stats.totalRides}</span>
              </div>
            </div>
            <div className="card" style={{ backgroundColor: '#e2cb00' }}>
              <div className='icon-container' style={{ backgroundColor: '#abb100' }}>
                <FontAwesomeIcon className='icon-config' icon={faPersonRunning} style={{ color: 'red' }} /> {/* Biểu tượng cho Running Rides */}
              </div>
              <div className='card-content'>
                <h4>Running Rides</h4>
                <span>{stats.runningRides}</span>
              </div>
            </div>
          </div>
          <div className="stats-row">
            <div className="card" style={{ backgroundColor: '#bc5642' }}>
              <div className='icon-container' style={{ backgroundColor: '#ae3a24' }}>
                <FontAwesomeIcon className='icon-config' icon={faRectangleXmark} style={{ color: 'white' }} /> {/* Biểu tượng cho Canceled Rides */}
              </div>
              <div className='card-content'>
                <h4>Canceled Rides</h4>
                <span>{stats.canceledRides}</span>
              </div>
            </div>
            <div className="card" style={{ backgroundColor: '#35cb46' }}>
              <div className='icon-container' style={{ backgroundColor: '#03a815' }}>
                <FontAwesomeIcon className='icon-config' icon={faFlagCheckered} style={{ color: 'white' }} /> {/* Biểu tượng cho Completed Rides */}
              </div>
              <div className='card-content'>
                <h4>Completed Rides</h4>
                <span>{stats.completedRides}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Phần 2: Biểu đồ */}
      <div className="charts-section">
        {/* Rides Statistic */}
        <RideChart />
        {/* <div className="chart">
          <div className='chart-header'>
            <FontAwesomeIcon icon={faChartLine} style={{ color: '#524545', fontSize: '28px' }} />
            <h3>Ride Status</h3>
          </div>
          <Line data={rideStatusData} options={options2} />
        </div> */}

        {/* <div className="chart">
          <div className='chart-header'>
            <FontAwesomeIcon icon={faChartPie} style={{ color: '#524545', fontSize: '28px' }} /> 
            <h3>Driver Statistics</h3>
          </div>
          <Doughnut data={driverStatisticsData} options={options} plugins={[centerTextPlugin]} />
        </div> */}
        <DriverChart />
      </div>



      {/* Phần 3: Bảng Recent Rides */}
      <div className="recent-rides">
        <h3>Recent Rides</h3>
        <table>
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Customer Name</th>
              <th>Driver Name</th>
              <th>Pickup / Drop Address</th> {/* Đã gộp chung một cột */}
              <th>Date</th>
              <th>Fare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentRides.map((ride, index) => (
              <tr key={index}>
                <td>{ride.tripId}</td>
                <td>{ride.customerName}</td>
                <td>{ride.driverName}</td>
                <td>
                  <div>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'blue' }} /> {ride.pickupAddress}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'red' }} /> {ride.dropAddress}
                  </div>
                </td> { }
                <td>{ride.date}</td>
                <td>{ride.fare}</td>
                <td>{ride.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
