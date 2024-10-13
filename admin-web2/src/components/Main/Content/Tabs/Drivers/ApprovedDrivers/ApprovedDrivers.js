import axios from "axios";
import { useEffect, useState } from "react";
import '../Drivers.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserEdit } from "@fortawesome/free-solid-svg-icons";


const ApprovedDrivers = ({ onSubPageChange }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDrivers, setTotalRides] = useState(0);
    const driversPerPage = 3;

    // get Drivers for table
    const fetchDrivers = async (offset, limit) => {
        try {
            const response = await axios.get('http://localhost:8080/trips/drivers', {
                params: {
                    offset: offset,
                    limit: limit,
                },
            });

            setDrivers(response.data.drivers);
            setTotalRides(response.data.total);
            console.log('Total driver:', response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalDrivers / driversPerPage);

    // fetch dữ liệu mỗi khi currentPage thay đổi.
    useEffect(() => {
        fetchDrivers((currentPage - 1) * driversPerPage, driversPerPage); // startRecord=? limit=? 
    }, [currentPage]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddDriver = () => {
        onSubPageChange('addDriver');
    }

    const handleDriverStatus = (driverId, currentStatus) => {
        onSubPageChange('driverStatus', { driverId, currentStatus });
    };

    const handleRideHistoryOfDriver = (driverId) => {
        onSubPageChange('driverHistory', { driverId });
    };

    const handleDriverStatement = (driverId) => {
        onSubPageChange('driverStatement', { driverId });
    };

    const handleDriverEdit = (driverId) => {
        onSubPageChange('driverEdit', { driverId });
    };


    return (
        <div className="drivers">
            <h2>Drivers</h2>
            <div className="form-buttons">
                <button onClick={handleAddDriver}>Add Driver</button>
                <button>Back</button>
            </div>
            <table id="driversTable">
                <thead>
                    <tr>
                        <th>DriverId</th>
                        <th>Driver Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Online / Offline</th>
                        <th>Status</th>
                        <th>Other Action</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver) => (
                        <tr key={driver.driverId}>
                            <td>{driver.driverId}</td>
                            <td>{driver.name}</td>
                            <td>{driver.email}</td>
                            <td>{driver.phone}</td>
                            <td>{driver.email}</td>
                            <td>
                                {driver.online === 'online' ? (
                                    <button className="btn-online" style={{backgroundColor: 'green', color: 'white'}}>
                                        Online
                                    </button>
                                ) : (
                                    <button className="btn-online" style={{backgroundColor: 'red', color: 'white'}}>
                                        Offline
                                    </button>
                                )}
                            </td>
                            <td>
                                <div className="form-buttons">
                                    {/* <button className="btn-green" onClick={() => handleDriverStatus(driver.driverId, driver.status)}>{driver.status}</button> */}

                                    {driver.status === 'Approved' ? (
                                        <button className="btn-green" onClick={() => handleDriverStatus(driver.driverId, driver.status)}>
                                            {driver.status}
                                        </button>
                                    ) : (
                                        <button className="btn-red" onClick={() => handleDriverStatus(driver.driverId, driver.status)}>
                                            {driver.status}
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="form-buttons">
                                    <button className="btn-yellow" onClick={() => handleRideHistoryOfDriver(driver.driverId)}>Ride History</button>
                                    <button className="btn-green" onClick={() => handleDriverStatement(driver.driverId)}>Statement</button>
                                </div>
                            </td>
                            <td>
                                <div className="form-buttons">
                                    <button className="btn-blue" onClick={() => handleDriverEdit(driver.driverId)}>
                                        <FontAwesomeIcon icon={faEdit} style={{color: 'white'}}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {currentPage !== 1 && (
                    <button onClick={() => handlePageChange(1)}>Đầu</button>
                )}

                {currentPage > 2 && (
                    <button onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</button>
                )}

                <span>{currentPage}</span>

                {currentPage < totalPages - 1 && (
                    <button onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</button>
                )}

                {currentPage !== totalPages && (
                    <button onClick={() => handlePageChange(totalPages)}>Cuối</button>
                )}
            </div>
        </div>
    );
};

export default ApprovedDrivers;