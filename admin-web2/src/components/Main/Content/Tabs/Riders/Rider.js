import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './Rider.css'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit, faHistory, faLock, faPen, faPenAlt, faRectangleXmark, faTrash, faTrashAlt, faTrashCan, faUnlock, faUserEdit } from '@fortawesome/free-solid-svg-icons';

const Rider = ({ onSubPageChange }) => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRiders, setTotalRides] = useState(0);
    const ridersPerPage = 1;

    // const navigate = useNavigate(); // Hook dùng để điều hướng

    useEffect(() => {
        const fetchRiders = async (offset, limit) => { // offset: pageNumber
            try {
                const response = await axios.get('http://localhost:8080/trips/riders', {
                    params: {
                        offset: offset,
                        limit: limit,
                    },
                });
                setRiders(response.data.riders);
                setTotalRides(response.data.total);
                console.log('Riders:', response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching riders:', error);
                setLoading(false);
            }
        };

        fetchRiders((currentPage - 1), ridersPerPage); // pageNumber = ? limit = ?
    }, [currentPage]);

    if (loading) {
        return <div>Loading...</div>
    }

    const totalPages = Math.ceil(totalRiders / ridersPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRideHistory = (riderId) => {
        // navigate(`/riders/${riderId}/history`); // Điều hướng đến trang RideHistory với riderId
        onSubPageChange('rideHistory', { riderId });
    };

    const handleRiderStatus = (riderId, currentStatus) => {
        // navigate(`/riders/${riderId}/status`, { state: { currentStatus } }); // Điều hướng đến trang RiderStatus với riderId
        onSubPageChange('riderStatus', { riderId, currentStatus });
    };

    const handleAddRider = () => {
        onSubPageChange('addRider'); // Điều hướng sang trang RiderAdd
    };



    return (
        <div className='riders'>
            <h2>Riders</h2>
            <div className='form-buttons'>
                <button onClick={handleAddRider}>Add Rider</button>
                <button onClick={() => onSubPageChange()}>Back</button>
            </div>
            <table id='ridersTable'>
                <thead>
                    <tr>
                        <th>Rider ID</th>
                        <th>Rider Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Reviews</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {riders.map((rider, index) => (
                        <tr key={index}>
                            <td>{rider.customerId}</td>
                            <td>{rider.firstName}</td>
                            <td>{rider.email}</td>
                            <td>{rider.phone}</td>
                            <td>..........</td>
                            <td>
                                <div className='form-buttons'>
                                    <button className='btn-history' onClick={() => handleRideHistory(rider.customerId)}>Ride History</button>
                                    <button className='btn-status' onClick={() => handleRiderStatus(rider.customerId, rider.status)}>{rider.status}</button>
                                </div>
                            </td>
                            <td>
                                <div className='form-buttons'>
                                    <button className='btn-edit'><FontAwesomeIcon icon={faUserEdit} style={{ color: 'white' }} /></button>
                                    <button className='btn-delete'><FontAwesomeIcon icon={faTrashCan} style={{ color: 'white' }} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagination'>
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

export default Rider;