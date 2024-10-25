import { faSearch, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";

const ReviewRating = () => {
    const [reviewRatings, setReviewRatings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRatings, setTotalRatings] = useState(0);
    const [loading, setLoading] = useState(true);
    const reviewRatingsPerPage = 10;

    // fetch dữ liệu cho reviewRatings
    const fetchReviewRatings = async (offset, limit) => {
        try {
            const response = await axios.get('http://localhost:8080/trips/review-rating', {
                params: {
                    offset: offset,
                    limit: limit,
                },
            });
            setReviewRatings(response.data.reviewRatings);
            setTotalRatings(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching review rating data:', error);
        }
    };

    useEffect(() => {
        fetchReviewRatings((currentPage - 1) * reviewRatingsPerPage, reviewRatingsPerPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalRatings / reviewRatingsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (ratingId) => {
        try {
            await axios.delete(`http://localhost:8080/trips/review-rating/delete/${ratingId}`);
        } catch (error) {
            console.error('Error deleting review & rating:', error);
        }

        fetchReviewRatings((currentPage - 1) * reviewRatingsPerPage, reviewRatingsPerPage);
    };

    return (
        <div>
            <h1>Reviews $ Ratings</h1>
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

                <div className="statement-table">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Ride ID</th>
                                <th>Driver Name</th>
                                <th>Rider Name</th>
                                <th>Rating</th>
                                <th>Date & Time</th>
                                <th>Comments</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewRatings.map((result, index) => (
                                <tr key={result.tripId}>
                                    <td>{(currentPage - 1) * reviewRatingsPerPage + index + 1}</td>
                                    <td>{result.tripId}</td>
                                    <td>{result.driverName}</td>
                                    <td>{result.customerName}</td>
                                    <td>
                                        {result.rating} <FontAwesomeIcon icon={faStar} style={{ color: 'orange' }} />
                                    </td>
                                    <td>{result.createdAt}</td>
                                    <td>{result.feedBack}</td>
                                    <td>
                                        <div className="form-buttons">
                                            <button className="btn-red" onClick={() => {
                                                if (window.confirm('Are you sure?')) {
                                                    handleDelete(result.ratingId);
                                                }
                                            }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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

export default ReviewRating;