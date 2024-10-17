import { faCarBattery, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import './VehicleType.css'
import axios from "axios";


const VehicleType = ({ onSubPageChange }) => {
    const [vehicles, setVehicles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [loading, setLoading] = useState(true);
    const vehiclesPerPage = 10;

    // fetch dữ liệu vehicle type
    const fetchVehicles = async (offset, limit) => {
        try {
            const response = await axios.get('http://localhost:8080/trips/vehicles', {
                params: {
                    offset: offset,
                    limit: limit,
                },
            });
            setVehicles(response.data.vehicles);
            setTotalVehicles(response.data.total);
            setLoading(false);
        } catch (error) {
            console.log('Error fetcing vehicles:', error);
        }
    };

    useEffect(() => {
        fetchVehicles(currentPage - 1, vehiclesPerPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalVehicles / vehiclesPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddVehicle = () => {
        onSubPageChange('addVehicleType');
    };

    return (
        <div className="vehicle-type">
            <h2>Vehicle Type</h2>
            <div className="statement-content">
                <div className="form-buttons">
                    <button className="btn-green" onClick={handleAddVehicle}>Add Vehicle Type</button>
                    <button>Back</button>
                </div>
                <div className="statement-table">
                    <div className="form-buttons">
                        <button>Copy</button>
                        <button>CSV</button>
                        <button>Excel</button>
                        <button>PDF</button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Cost Per Km</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map(vehicle => (
                                <tr key={vehicle.vehicleId}>
                                    <td>{vehicle.vehicleId}</td>
                                    <td className="center">
                                        <img
                                            src={`http://localhost:8080/images/${vehicle.img}`} // Đường dẫn HTTP từ Spring Boot
                                            alt={vehicle.name}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>{vehicle.name}</td>
                                    <td>{vehicle.cost} $</td>
                                    <td>{vehicle.status}</td>
                                    <td>{vehicle.createdAt}</td>
                                    <td>
                                        <div className='form-buttons'>
                                            <button className='btn-blue'>
                                                <FontAwesomeIcon icon={faEdit} style={{ color: 'white' }} />
                                            </button>
                                            <button className="btn-red">
                                                <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>

                </div>
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
        </div>
    );
};

export default VehicleType;