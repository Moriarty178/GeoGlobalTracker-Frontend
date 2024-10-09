import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";


const RideHistory = ({ riderId, onSubPageChange }) => {
    // const { riderId } = useParams(); // Lấy riderId từ URL
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRides, setTotalRides] = useState(0);
    const ridePerPage = 10;

    useEffect(() => {
        const fetchRideHistory = async (offset, limit) => { // offset : pageNumber
            console.log('offset : limit', offset, limit);
            try {
                const response = await axios.get(`http://localhost:8080/trips/${riderId}/history`, {
                    params: {
                        offset: offset,
                        limit: limit,
                    },
                });

                console.log("Data ------>:", response.data);
                setTrips(response.data.rides);
                setTotalRides(response.data.total);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching rides:', error);
                setLoading(false);
            }
        };

        fetchRideHistory((currentPage - 1) , ridePerPage); // pageNumber = ? limit = ?
    }, [currentPage]);
  

    if (loading) {
        return <div>Loading...</div>
    }

    const totalPages = Math.ceil(totalRides / ridePerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBack = () => {
        onSubPageChange(null);
    };


    return (
        <div>
            <h2>Ride History for Rider {riderId}</h2>
            <div className="form-buttons">
                <button type="button" onClick={handleBack}>Back</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Trip ID</th>
                        <th>Pickup / Drop Address</th>
                        <th>Fare</th>
                        <th>Status</th>
                        <th>Date</th >
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip, index) => (
                        <tr key={trip.tripId}>
                            <td>{trip.tripId}</td>
                            <td>
                                <div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'blue' }} /> {JSON.parse(trip.source).display_name}
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'Red' }} /> {JSON.parse(trip.destination).display_name}
                                </div>
                            </td>
                            <td>{(trip.distance * 1.2).toFixed(1)} $</td>
                            <td>{trip.status}</td>
                            <td>{trip.createdAt}</td>
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

export default RideHistory;