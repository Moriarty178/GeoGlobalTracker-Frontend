import { useEffect, useState } from 'react';
import './Rider.css'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan, faUserEdit } from '@fortawesome/free-solid-svg-icons';

const Rider = ({ onSubPageChange }) => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRiders, setTotalRides] = useState(0);
    const ridersPerPage = 4;

    // const navigate = useNavigate(); // Hook dùng để điều hướng

    // Tách hàm fetch ra ngoài dùng lại khi cần thiết vd: update table after delete
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

    // fetch dữ liệu mỗi khi currentPage thay đổi
    useEffect(() => {
        // const fetchRiders = async (offset, limit) => { 
        // ................
        // };
        fetchRiders((currentPage - 1), ridersPerPage); // pageNumber = ? limit = ?
    }, [currentPage]);

    // Hàm chuyến trang (pagination)
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddRider = () => {
        onSubPageChange('addRider'); // Điều hướng sang trang <RiderAdd />
    };

    const handleRideHistory = (riderId) => {
        // navigate(`/riders/${riderId}/history`); 
        onSubPageChange('rideHistory', { riderId }); // Điều hướng đến trang <RideHistory /> với riderId
    };

    const handleRiderStatus = (riderId, currentStatus) => {
        // navigate(`/riders/${riderId}/status`, { state: { currentStatus } }); 
        onSubPageChange('riderStatus', { riderId, currentStatus }); // Điều hướng đến trang <RiderStatus /> với riderId
    };

    const handleEditRider = (riderId) => {
        onSubPageChange('editRider', { riderId }); // Điều hướng đến trang <RiderEdit />
    };

    const handleDeleteRider = async (riderId) => { // hàm xóa rider
        try {
            const response = await axios.delete(`http://localhost:8080/trips/riders/${riderId}`);
            console.log("Status: ", response.data);
            fetchRiders(currentPage, ridersPerPage);
        } catch (error) {
            console.error('Error deleting rider: ', error);
        };
    };

    if (loading) {
        return <div>Loading...</div>
    }

    const totalPages = Math.ceil(totalRiders / ridersPerPage);

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
                    {riders.map((rider) => (
                        <tr key={rider.customerId}>
                            <td>{rider.customerId}</td>
                            <td>{rider.firstName}</td>
                            <td>{rider.email}</td>
                            <td>{rider.phone}</td>
                            <td>..........</td>
                            <td>
                                <div className='form-buttons'>
                                    <button className='btn-yellow' onClick={() => handleRideHistory(rider.customerId)}>Ride History</button>
                                    {rider.status === 'Approved' ? (
                                        <button className='btn-green' onClick={() => handleRiderStatus(rider.customerId, rider.status)}>
                                            {rider.status}
                                        </button>
                                    ) : (
                                        <button className='btn-red' onClick={() => handleRiderStatus(rider.customerId, rider.status)}>
                                            {rider.status}
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className='form-buttons'>
                                    <button className='btn-blue' onClick={() => handleEditRider(rider.customerId)}><FontAwesomeIcon icon={faEdit} style={{ color: 'white' }} /></button>
                                    {/* Click delete -> window confirm -> confirm -> handleDelete */}
                                    <button className='btn-red'
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete rider ${rider.firstName}?`)) {
                                                handleDeleteRider(rider.customerId);
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={faTrashCan} style={{color: 'white'}} />
                                    </button>
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