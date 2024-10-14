import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DriverStatement.css'
import { faCar, faFlagCheckered, faMapMarkerAlt, faMoneyBillTrendUp, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';


const DriverStatement = ({ driverId, onSubPageChange }) => {
    const [trips, setTrips] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTrips, setTotalTrips] = useState(0);
    const [loading, setLoading] = useState(true);
    const tripsPerPage = 10;

    // dữ liệu cho stats
    const [stats, setStats] = useState({
        totalTrips: 0,
        canceledTrips: 0,
        completedTrips: 0,
        revenue: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/drivers/stats/${driverId}`);
                
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching data stats:', error);
            }
        };

        fetchStats();
    }, []);// thêm [] tránh vòng l


    // fetch dữ liệu history 
    useEffect(() => {
        const fetchTripsHistory = async (offset, limit) => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/drivers/history/${driverId}`, {
                    params: {
                        offset: offset,
                        limit: limit,
                    },
                });

                setTrips(response.data.trips);
                setTotalTrips(response.data.total);
                setLoading(false);
            } catch (error) {
                console.error(error.response.data);
                setLoading(false);
            }
        };

        fetchTripsHistory(currentPage - 1, tripsPerPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalTrips / tripsPerPage);

    if (loading) {
        return <h2>Loading...</h2>
    }

    const handleBack = () => {
        onSubPageChange(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    return (
        <div>
            <div className='statement-header'>
                <h2>Statement</h2>
                <div className="form-stats">
                    <div className="card" style={{ background: '#ff9800' }}>
                        <div className="card-icon bg-n-color-car"> {/* Thên div phụ để padding trong khuôn khổ không bị tràn */}
                            <FontAwesomeIcon className='card-icon-config' icon={faCar} />
                        </div>
                        <div className='card-content'>
                            <h4>Total No of Ride</h4>
                            <span>{stats.totalTrips}</span>
                        </div>
                    </div>

                    <div className="card" style={{ background: '#bc5642' }}>
                        <div className="card-icon bg-n-color-canceled">
                            <FontAwesomeIcon className="card-icon-config" icon={faRectangleXmark} />
                        </div>
                        <div className="card-content">
                            <h4>Canceled Ride</h4>
                            <span>{stats.canceledTrips}</span>
                        </div>
                    </div>

                    <div className="card" style={{ background: '#35cb46' }}>
                        <div className="card-icon bg-n-color-completed">
                            <FontAwesomeIcon className='card-icon-config' icon={faFlagCheckered} />
                        </div>
                        <div className="card-content">
                            <h4>Completed</h4>
                            <span>{stats.completedTrips}</span>
                        </div>
                    </div>

                    <div className="card" style={{ background: '#f631c7' }}>
                        <div className="card-icon bg-n-color-revenue">
                            <FontAwesomeIcon className='card-icon-config' icon={faMoneyBillTrendUp} />
                        </div>
                        <div className="card-content">
                            <h4>Revenue</h4>
                            <span>{stats.revenue} $</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='statement-content'>
                <div className='form-buttons'>
                    <button onClick={handleBack}>Back</button>
                </div>
                <div className='statement-table'>

                    <div className='form-buttons'>
                        <button>Copy</button>
                        <button>CSV</button>
                        <button>Excel</button>
                        <button>PDF</button>
                        <div className='form-search'>
                            <h4>Search:</h4>
                            <input />
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Picked Up</th>
                                <th>Dropped</th>
                                <th>Date On</th>
                                <th>Earned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map(trip => (
                                <tr key={trip.tripId}>
                                    <td>{trip.tripId}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'blue' }} /> {JSON.parse(trip.source).display_name}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'red' }} /> {JSON.parse(trip.destination).display_name}</td>
                                    <td>{trip.createdAt}</td>
                                    <td>............</td>
                                    <td>{trip.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='pagination'>
                    {currentPage !== 1 && (
                        <button onClick={() => handlePageChange(1)}>Đầu</button>
                    )}

                    {currentPage > 2 && (
                        <button onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</button>
                    )}

                    {currentPage < totalPages - 1 && (
                        <button onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</button>
                    )}

                    {currentPage !== totalPages && (
                        <button onClick={() => handlePageChange(totalPages)}>Cuối</button>
                    )}

                </div>
            </div>
        </div >
    );
};

export default DriverStatement;