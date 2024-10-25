import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";



const DriverPaymentReports = ({ onSubPageChange }) => {
    const [resultReports, setResultReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const resultsPerPage = 9;

    // fetch dữ liệu driverReports
    const fetchDriverReports = async (offset, limit) => {
        try {
            const response = await axios.get('http://localhost:8080/trips/driver-payment-report', {
                params: {
                    offset: offset,
                    limit: limit,
                },
            });
            setResultReports(response.data.resultReports);
            setTotalResults(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching DriverReports data:', error);
        }
    };

    useEffect(() => {
        fetchDriverReports((currentPage - 1) * resultsPerPage, resultsPerPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div>
            <h1>Driver Payment Reports</h1>
            <div className="form-buttons">
                <button>Back</button>
            </div>
            <div className="statement-content">
                <div className="form-buttons">
                    <button>Copy</button>
                    <button>CSV</button>
                    <button>Excel</button>
                    <button>PDF</button>
                    <div className="form-search">
                        <span>Search</span>
                        <div className="input-container">
                            <input />
                            <FontAwesomeIcon className="search-icon" icon={faSearch} />
                        </div>
                    </div>
                </div>
                <table className="statement-table">
                    <thead>
                        <tr>
                            <td>No.</td>
                            <th>Driver Name</th>
                            <th>Driver Account No.</th>
                            <th>Driver Bank Name</th>
                            <th>A = Total Ride Amount</th>
                            <th>B= Site Commission</th>
                            <th>C = A - B<br></br> Driver Payment Amount</th>
                            <th>Payment Method</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultReports.map((result, index) => (
                            <tr key={result.driverId}>
                                <td>{(currentPage -1) * resultsPerPage + index + 1}</td>
                                <td>{result.driverName}</td>
                                <td>{result.driverAccountNo}</td>
                                <td>{result.driverBankName}</td>
                                <td>{result.totalRevenue.toFixed(2)} $</td>
                                <td>{result.commission.toFixed(2)} $</td>
                                <td>{result.driverPaymentAmount.toFixed(2)} $</td>
                                <td>{result.paymentMethod}</td>
                                <td>
                                    <button>View Details</button>
                                </td>
                            </tr>
                        ))}

                        {/* Tính tổng */}
                        <tr>
                            <td colSpan="7"></td>
                            <td><strong>Total Ride</strong></td>
                            <td>{resultReports.reduce((acc, result) => acc + result.totalRevenue, 0).toFixed(2)} $</td>
                        </tr>
                        <tr>
                            <td colSpan="7"></td>
                            <td><strong>Total Commission</strong></td>
                            <td>- {resultReports.reduce((acc, result) => acc + result.commission, 0).toFixed(2)} $</td>
                        </tr>
                        <tr>
                            <td colSpan="7"></td>
                            <td><strong>Driver Payment Amount</strong></td>
                            <td>{resultReports.reduce((acc, result) => acc + result.driverPaymentAmount, 0).toFixed(2)} $</td>
                        </tr>
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
    );

};

export default DriverPaymentReports;