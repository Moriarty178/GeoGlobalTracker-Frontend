import { faEdit, faSearch, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";



const PromoCode = ({ onSubPageChange }) => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [totalPromoCodes, setTotalPromoCodes] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const resultsPerPage = 11;

    //fetch dữ liêu cho promoCodes
    const fetchPromoCode = async (offset, limit) => {
        try {
            const response = await axios.get('http://localhost:8080/trips/promo-code', {
                params: {
                    offset: offset,
                    limit: limit,
                },
            });
            setPromoCodes(response.data.promoCodes);
            setTotalPromoCodes(response.data.total);
            setLoading(true);
        } catch (error) {
            console.error('Error fetching promo-code data:', error);
        }
    };

    useEffect(() => {
        fetchPromoCode(currentPage - 1, resultsPerPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalPromoCodes / resultsPerPage);

    const handleAddPromoCode = () => {
        onSubPageChange('addPromoCode');
    };

    const handleEditPromoCode = (promoId) => {
        onSubPageChange('editPromoCode', { promoId });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (promoId) => {
        try {
            await axios.delete(`http://localhost:8080/trips/promo-code/delete/${promoId}`);
        } catch (error) {
            console.error('Error deleting promo code:', error);
        }

        fetchPromoCode(currentPage - 1, resultsPerPage);
    };

    return (
        <div>
            <h1>Promo Code</h1>
            <div className="form-buttons">
                <button onClick={handleAddPromoCode} className="btn-green">Add Promo Code</button>
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
                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>Promo ID</th> */}
                            <th>No.</th>
                            <th>Name / Title</th>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Usage Limit</th>
                            <th>User Used</th>
                            <th>Expired Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promoCodes.map((promoCode, index) => (
                            <tr key={promoCode.promoId}>
                                <td>{(currentPage - 1) * resultsPerPage + index + 1}</td>
                                <td>{promoCode.name}</td>
                                <td>{promoCode.code}</td>
                                <td>{promoCode.type}</td>
                                <td>
                                    {promoCode.type === 'flat' ? (
                                        promoCode.value + ' $'
                                    ) : (
                                        promoCode.value + ' %'
                                    )}
                                </td>
                                <td>{promoCode.usageLimit}</td>
                                <td>{promoCode.totalUserUsed}</td>
                                <td>{promoCode.expiredDate}</td>
                                <td>
                                    {promoCode.status === 'active' ? (
                                        <button className="btn-online" style={{ background: 'green', color: 'white' }}>{promoCode.status}</button>
                                    ) : (
                                        <button className="btn-online" style={{ background: 'red', color: 'white' }}>{promoCode.status}</button>
                                    )}
                                </td>
                                <td>
                                    <div className="form-buttons">
                                        <button onClick={() => handleEditPromoCode(promoCode.promoId)} className="btn-blue">
                                            <FontAwesomeIcon icon={faEdit} style={{ color: 'white' }} />
                                        </button>
                                        <button className="btn-red" onClick={() => {
                                            if (window.confirm('Are you sure want to delete this promo code!')) {
                                                handleDelete(promoCode.promoId);
                                            }
                                        }}>
                                            <FontAwesomeIcon icon={faTrashCan} style={{ color: 'white' }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                        )}
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

export default PromoCode;