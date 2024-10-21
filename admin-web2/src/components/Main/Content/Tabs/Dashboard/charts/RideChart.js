import React, { useEffect, useState } from 'react';
import './Charts.css'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title } from 'chart.js';
import 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faChartLine } from '@fortawesome/free-solid-svg-icons'; 

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title, zoomPlugin);

const RideChart = () => {
    const [rideStatusData, setRideStatusData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Running Rides',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Canceled Rides',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Completed Rides',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    });

    const [currentStartIndex, setCurrentStartIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchRideStatusData = async (start, limit) => {
        try {
            const response = await fetch(`http://localhost:8080/trips/api/ride-status-data?start=${start}&limit=${limit}`);
            const data = await response.json();
            // console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching ride status data:', error);
            return null;
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const initialData = await fetchRideStatusData(0, 12);
            if (initialData) {
                const formattedLabels = initialData.labels.map(label => {
                    const [year, month] = label.split('-');
                    return new Date(year, month - 1, 1).getTime(); // Chuyển đổi thành timestamp
                });

                // console.log('InitiaData labels:', formattedLabels);
                
                setRideStatusData({
                    labels: formattedLabels, // Sử dụng timestamp cho nhãn
                    datasets: initialData.datasets.map((dataset, index) => ({
                        ...rideStatusData.datasets[index],
                        data: dataset.data,
                    })),
                });
                // setRideStatusData((prevData) => ({
                //     labels: formattedLabels, // Sử dụng timestamp cho nhãn
                //     datasets: prevData.datasets.map((dataset, index) => ({
                //         ...dataset,
                //         data: initialData.datasets[index].data || [],
                //     })),
                // }));
                setCurrentStartIndex(12);
            }
            setLoading(false);
        };

        loadInitialData();
    }, []);


    // in ra console kết quả để kiểm tra
    // useEffect(() => {
    //     console.log("Updated rideStatusData: ", rideStatusData);
    // }, [rideStatusData]);

    const loadMoreData = async (direction) => {
        if (!loading) {
            setLoading(true);
            let newData;

            if (direction === 'past') {
                newData = await fetchRideStatusData(currentStartIndex, 12);
                if (newData) {
                    const formattedLabels = newData.labels.map(label => { // phải đổi được về dạng timestamp thì mới lấy được { min, max } = chart.scales.x để đem đi so sánh (trục x phải là type: 'time') => so sánh được ngày thì mới có thể gọi đúng hàm loadMoreDate(past || current).
                        const [year, month] = label.split('-');
                        return new Date(year, month - 1, 1).getTime(); // Chuyển đổi thành timestamp
                    });


                    setRideStatusData({
                        labels:formattedLabels,
                        datasets: newData.datasets.map((dataset, index) => ({
                            ...rideStatusData.datasets[index],
                            data: dataset.data, 
                        })),
                    });
                    // setRideStatusData((prevData) => ({
                    //     labels:formattedLabels,
                    //     datasets: prevData.datasets.map((dataset, index) => ({
                    //         ...dataset,
                    //         data: [...newData.datasets[index].data, ...dataset.data], 
                    //     })),
                    // }));
                    setCurrentStartIndex(currentStartIndex + 12);
                }
            } else if (direction === 'current') {
                newData = await fetchRideStatusData(currentStartIndex - 12, 12);
                if (newData) {
                    const formattedLabels = newData.labels.map(label => {
                        const [year, month] = label.split('-');
                        return new Date(year, month - 1, 1).getTime(); // Chuyển đổi thành timestamp
                    });
                    setRideStatusData({
                        labels:formattedLabels, //[...prevData.labels, ...uniqueLabels], // Gộp nhãn hiện tại vào
                        datasets: newData.datasets.map((dataset, index) => ({
                            ...rideStatusData.datasets[index],
                            data: dataset.data, 
                        })),
                    });
                    setCurrentStartIndex(currentStartIndex - 12);
                }
            }
            setLoading(false);
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ride Status by Month',
                font: {
                    size: 18,
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                    onPanComplete: ({ chart }) => {
                        const { min, max } = chart.scales.x;
                        const minDate = rideStatusData.labels[0]; 
                        const maxDate = rideStatusData.labels[rideStatusData.labels.length - 1]; 

                        const isPast = max < maxDate; 
                        const isCurrent = min > minDate; 

                        if (isPast) {
                            console.log("call past");
                            loadMoreData('past');
                        } else if (isCurrent) {
                            console.log("call current");
                            loadMoreData('current');
                        }
                    },
                },
                zoom: {
                    enabled: true,
                    mode: 'x',
                    onZoomComplete: ({ chart }) => {
                        const { min, max } = chart.scales.x;
                        const minDate = rideStatusData.labels[0]; 
                        const maxDate = rideStatusData.labels[rideStatusData.labels.length - 1]; 

                        const isPast = max < maxDate; 
                        const isCurrent = min > minDate; 

                        if (isPast) {
                            console.log("call past");
                            loadMoreData('past');
                        } else if (isCurrent) {
                            console.log("call current");
                            loadMoreData('current');
                        }
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    tooltipFormat: 'MMM yyyy',
                },
                ticks: {
                    maxTicksLimit: 12,
                },
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Rides',
                },
            },
        },
        animation: {
            duration: 500,
            easing: 'easeInOutQuad',
        },
    };

    return (
        <div className="chart">
            <div className='chart-header'>
                <FontAwesomeIcon icon={faChartLine} style={{ color: '#524545', fontSize: '28px' }} />
                <h3>Ride Status</h3>
            </div>
            <Line data={rideStatusData} options={options} />
        </div>
    );
};

export default RideChart;
