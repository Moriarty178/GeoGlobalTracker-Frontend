import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import './AdminEarningReports.css'


const AdminEarningReports = ({ onSubPageChange }) => {
    const [resultReports, setResultReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const resultsPerPage = 9;

    //fetch dữ liệu resultReports
    const fetchResultEarning = async (offset, limit) => {
        try {
            const response = await axios.get('http://localhost:8080/trips/earning-admin-report', {
                params: {
                    offset: offset,
                    limit: limit,
                },
            });
            setResultReports(response.data.resultReports);
            setTotalResults(response.data.total);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching result earning data:', error);
        }
    };

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    useEffect(() => {
        fetchResultEarning((currentPage - 1) * resultsPerPage, resultsPerPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div className="admin-earning-report">
            <h2>Earning Reports</h2>
            <div className="statement-content">
                <div className="form-buttons">
                    <button>Back</button>
                </div>
                <div className="statement-table">
                    <div className="form-buttons">
                        <button>Copy</button>
                        <button>CSV</button>
                        <button>Excel</button>
                        <button>PDF</button>
                        <div className="form-search">
                            <h4>Search</h4>
                            <div className="input-container">
                                <input type="text" />
                                <FontAwesomeIcon className="search-icon" icon={faSearch} style={{ color: 'blue' }} />
                            </div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Trip ID</th>
                                {/* <th>Ride Type</th> */}
                                <th>Driver Name</th>
                                <th>Rider Name</th>
                                <th>Date</th>
                                <th>A = Total Ride</th>
                                <th>B = Site Commission</th>
                                <th>C = A - B <br></br> Driver Payment Ammount</th>
                                <th>D = B <br></br> Admin Earning Ammount</th>
                                <th>Payment Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultReports.map((result, index) => (
                                <tr key={result.tripId}>
                                    <td>{(currentPage - 1) * resultsPerPage + index + 1}</td>
                                    <td>{result.tripId}</td>
                                    <td>{result.driverName}</td>
                                    <td>{result.customerName}</td>
                                    <td>{result.createdAt}</td>
                                    <td>{result.totalRevenue} $</td>
                                    <td>{result.commission.toFixed(2)} $</td>
                                    <td>{result.driverPaymentAmount.toFixed(2)} $</td>
                                    <td>{result.adminEarningAmount.toFixed(2)} $</td>
                                    <td>{result.paymentMethod}</td>
                                </tr>
                            ))}
                            
                            {/* Thông tin tổng */}
                            <tr>
                                <td colSpan="8"></td>
                                <td><strong>Pay to Drivers</strong></td>
                                <td>{resultReports.reduce((acc, result) => acc + result.driverPaymentAmount, 0).toFixed(2)} $</td>
                            </tr>
                            <tr>
                                <td colSpan="8"></td>
                                <td><strong>Total Earnings</strong></td>
                                <td>{resultReports.reduce((acc, result) => acc + result.commission, 0).toFixed(2)} $</td>
                            </tr>
                            <tr>
                                <td colSpan="8"></td>
                                <td><strong>Total Ride Amount</strong></td>
                                <td>{resultReports.reduce((acc, ref) => acc + ref.totalRevenue, 0).toFixed(2)} $</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
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
    );
};

export default AdminEarningReports;