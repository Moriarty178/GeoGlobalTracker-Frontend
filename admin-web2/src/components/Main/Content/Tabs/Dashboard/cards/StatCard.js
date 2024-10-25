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
                        <div className='card-icon' style={{ backgroundColor: 'green' }}>
                            <FontAwesomeIcon className='card-icon-config' icon={faUsersLine} style={{ color: '#0100f3' }} /> {/* Biểu tượng cho Total Riders */}
                        </div>
                        <div className='card-content'>
                            <h4>Total Customers</h4>
                            <span>{stats.totalRiders}</span>
                        </div>
                    </div>
                    <div className="card" style={{ backgroundColor: '#2196F3' }}>
                        <div className='card-icon' style={{ backgroundColor: '#2020eb' }}>
                            <FontAwesomeIcon className='card-icon-config' icon={faUserAstronaut} style={{ color: '#00ffed' }} /> {/* Biểu tượng cho Total Drivers */}
                        </div>
                        <div className='card-content'>
                            <h4>Total Drivers</h4>
                            <span>{stats.totalDrivers}</span>
                        </div>
                    </div>
                </div>
                <div className="stats-row" >
                    <div className="card" style={{ backgroundColor: '#FF9800' }}>
                        <div className='card-icon bg-n-color-car'>
                            <FontAwesomeIcon className='card-icon-config' icon={faCar} /> {/* Biểu tượng cho Vehicle Type */}
                        </div>
                        <div className='card-content'>
                            <h4>Vehicle Type</h4>
                            <span>{stats.vehicleType}</span>
                        </div>
                    </div>
                    <div className="card" style={{ backgroundColor: '#e40606' }}>
                        <div className='card-icon bg-n-color-revenue'>
                            <FontAwesomeIcon className='card-icon-config' icon={faMoneyBillTrendUp} /> {/* Biểu tượng cho Revenue */}
                        </div>
                        <div className='card-content'>
                            <h4>Revenue</h4>
                            <span>{ new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(stats.revenue)} $</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="stats-right">
                <h3>Ride Statistics</h3> {/* Tiêu đề cho nhóm thẻ thống kê */}
                <div className="stats-row">
                    <div className="card" style={{ backgroundColor: '#1285c0' }}>
                        <div className='card-icon' style={{ backgroundColor: '#075c69' }}>
                            <FontAwesomeIcon className='card-icon-config' icon={faRoad} style={{ color: 'white' }} /> {/* Biểu tượng cho Total Rides */}
                        </div>
                        <div className='card-content'>
                            <h4>Total Rides</h4>
                            <span>{stats.totalRides}</span>
                        </div>
                    </div>
                    <div className="card" style={{ backgroundColor: '#e2cb00' }}>
                        <div className='card-icon' style={{ backgroundColor: '#abb100' }}>
                            <FontAwesomeIcon className='card-icon-config' icon={faPersonRunning} style={{ color: 'red' }} /> {/* Biểu tượng cho Running Rides */}
                        </div>
                        <div className='card-content'>
                            <h4>Running Rides</h4>
                            <span>{stats.runningRides}</span>
                        </div>
                    </div>
                </div>
                <div className="stats-row">
                    <div className="card" style={{ backgroundColor: '#bc5642' }}>
                        <div className='card-icon bg-n-color-canceled'>
                            <FontAwesomeIcon className='card-icon-config' icon={faRectangleXmark} /> {/* Biểu tượng cho Canceled Rides */}
                        </div>
                        <div className='card-content'>
                            <h4>Canceled Rides</h4>
                            <span>{stats.canceledRides}</span>
                        </div>
                    </div>
                    <div className="card" style={{ backgroundColor: '#35cb46' }}>
                        <div className='card-icon bg-n-color-completed'>
                            <FontAwesomeIcon className='card-icon-config' icon={faFlagCheckered}/> {/* Biểu tượng cho Completed Rides */}
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
