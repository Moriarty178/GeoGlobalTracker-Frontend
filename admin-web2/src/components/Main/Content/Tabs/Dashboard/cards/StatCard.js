import React, { useEffect, useState } from 'react';
import './StatCards.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faFlagCheckered, faMoneyBillTrendUp, faPersonRunning, faRectangleXmark, faRoad, faUserAstronaut, faUsersLine } from '@fortawesome/free-solid-svg-icons'; // Import faMapMarkerAlt

const StatCards = () => {
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



    return (
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
    );
};

export default StatCards;
