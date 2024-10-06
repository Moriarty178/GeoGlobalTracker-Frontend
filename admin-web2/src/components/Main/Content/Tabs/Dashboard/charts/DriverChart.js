import React, { useEffect, useRef, useState } from 'react';
import './Charts.css'
import { Doughnut } from 'react-chartjs-2'; // Giả sử bạn sẽ sử dụng chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, ArcElement, BarElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faChartPie } from '@fortawesome/free-solid-svg-icons'; // Import faMapMarkerAlt
import ChartDataLabels from 'chartjs-plugin-datalabels'
// import axios from 'axios'
import 'chart.js/auto'

ChartJS.register(Title, Tooltip, Legend, ChartDataLabels, LineElement, ArcElement, BarElement, CategoryScale, LinearScale, zoomPlugin);  // Đăng ký các thành phần cần thiết

const DriverChart = () => {
    // State để lưu trữ giá trị hiển thị ở giữa biểu đồ Doughnut
    const [centerValue, setCenterValue] = useState('click a section');

    // Dữ liệu Driver Statistic
    const driverStatisticsData = {
        labels: ['Approved Drivers', 'Blocked Drivers', 'Pending Drivers'],
        datasets: [
            {
                label: 'Driver Statistics',
                data: [279, 143, 157],
                backgroundColor: ['blue', '#2dc71c', '#4695d4'],
                hoverOffset: 36,
            },
        ],
    };

    // Plugin để hiển thị giá trị ở giữa biểu đồ (drivers)
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart) => {
            const { ctx, width, height } = chart;
            ctx.save();
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000'; // Màu chữ

            // const text = centerValue; // sẽ ko cập nhật được khi centerValue thay đổi BỞI VI khi component re-renders,nó tạo ra context mới, -> nếu chỉ định centerValue trực tiếp thì nó sẽ KHÔNG CẬP NHẬT khi có thay đổi.
            // Lấy giá trị centerValue để tách dòn
            const centerValue = chart.options.plugins.centerTextPlugin.centerValue || 'Click a section'; // Dùng getContext của chart để lấy giá tị mới nhất của centerValue
            const lines = centerValue.split('\n');

            const lineHeight = 30;
            const startY = height * 0.55; // Điều chỉnh vị trí khởi đầu y

            // Vẽ từng dòng
            lines.forEach((line, index) => {
                ctx.fillText(line, width / 2, startY + index * lineHeight); // Vẽ từng dòng
            });

            ctx.restore(); // Khôi phục trạng thái canvas
        },
    };

    // Options cho biểu đồ drivers
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: `Total Drivers: ${24}`,
                font: {
                    size: 18,
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
            tooltip: {
                enabled: false,
            },
            datalabels: {
                display: false, // Ẩn giá trị trên từng phần của biểu đồ Doughnut
            },
            centerTextPlugin: {
                centerValue: centerValue // Ghi lại giá trị centerValue vào options
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const clickedIndex = elements[0].index; // Lấy chỉ số phần tử được nhấn
                const label = driverStatisticsData.labels[clickedIndex]; // láy label tương ứng phần tử được click
                const count = driverStatisticsData.datasets[0].data[clickedIndex];
                setCenterValue(`${label}\n${count}`); // Cập nhật giá trị hiển thị
            }
        },
    };

    return (
        <div className="chart">
            <div className='chart-header'>
                <FontAwesomeIcon icon={faChartPie} style={{ color: '#524545', fontSize: '28px' }} /> {/* Biểu tượng cho Completed Rides */}
                <h3>Driver Statistics</h3>
            </div>
            <Doughnut data={driverStatisticsData} options={options} plugins={[centerTextPlugin]} />
        </div>
    );
}

export default DriverChart;