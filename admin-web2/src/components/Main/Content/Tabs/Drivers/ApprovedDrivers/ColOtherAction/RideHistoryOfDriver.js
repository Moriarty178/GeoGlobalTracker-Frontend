import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";


const RideHistoryOfDriver = ({driverId, onSubPageChange}) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRides, setTotalRides] = useState(0);
    const tripsPerPage = 10;

    //fetch lấy dữ liệu
    

    useEffect(() => {
        const fetchTrips = async (offset, limit) => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/drivers/history/${driverId}`, {
                    params: {
                        offset: offset,
                        limit: limit,
                    },
                });
    
                setTrips(response.data.trips);
                setTotalRides(response.data.total);
                setLoading(false);
            } catch(error) {
                console.error('Error fetching history of Driver:', error);
                setLoading(false);
            }
        };

        fetchTrips(currentPage - 1, tripsPerPage);
    }, [currentPage]);

    if (loading) {
        return <h2>Loading...</h2>
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleBack = () => {
        onSubPageChange(null);
    };

    const totalPages = Math.ceil(totalRides / tripsPerPage);

    return (
        <div>
            <h2>History</h2>
            <div className="form-buttons">
                <button onClick={handleBack}>Back</button>
            </div>
            <table>
                <thead>
                    <tr>
                    <th>Trip ID</th>
                    <th>Pickup / Drop Address</th>
                    <th>Fare</th>
                    <th>Status</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip) => (
                        <tr key={trip.tripId}>
                            <td>{trip.tripId}</td>
                            <td>
                                <div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: 'blue'}} /> {JSON.parse(trip.source).display_name}
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: 'red'}} /> {JSON.parse(trip.destination).display_name}
                                </div>
                            </td>
                            <td>{(trip.distance * 1.2).toFixed(1)}$</td>
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
                    <button onClick={() => handlePageChange(currentPage + 1) }>{currentPage + 1}</button>
                )}

                {currentPage !== totalPages && (
                    <button onClick={() => handlePageChange(totalPages)}>Cuối</button>
                )}
            </div>
        </div>
    );
};

export default RideHistoryOfDriver;