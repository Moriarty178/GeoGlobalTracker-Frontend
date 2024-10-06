import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './RecentRide.css'

const RecentRide = () => {
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRides, setTotalRides] = useState(0);
  const ridesPerPage = 10; // số lượng chuyến đi mỗi trang

  useEffect(() => {
    // Gọi API để lấy dữ liệu từ backend
    const fetchRecentRides = async (offset, limit) => {
      try {
        const response = await axios.get('http://localhost:8080/trips/recent-rides', {
          params: {
            offset: offset,
            limit: limit,
          },
        });
        setRecentRides(response.data.rides); // Giả định response.data chứa thông tin rides
        setTotalRides(response.data.total); // Giả định response.data có tổng số rides
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent rides:', error);
        setLoading(false);
      }
    };

    fetchRecentRides((currentPage - 1) * ridesPerPage, ridesPerPage);
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(totalRides / ridesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatus = (status) => {
    switch (status) {
      case "1": return "Chưa tài xế nào nhận!";
      case "2": return "Đã có tài xế nhận";
      case "3": return "Đã đón khách";
      case "4": return "Đã trả khách";
      case "5": return "Đã hủy";
      default: return "NaN";
    }
  };

  return (
    <div className="recent-rides">
      <h3>Recent Rides</h3>
      <table>
        <thead>
          <tr>
            <th>Trip ID</th>
            <th>Customer Name</th>
            <th>Driver Name</th>
            <th>Pickup / Drop Address</th>
            <th>Date</th>
            <th>Fare</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentRides.map((ride, index) => (
            <tr key={index}>
              <td>{ride.tripId}</td>
              <td>{ride.customerName}</td>
              <td>{ride.driverName ? ride.driverName : 'N/A'}</td>
              <td>
                <div>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'blue' }} /> {JSON.parse(ride.source).display_name}
                </div>
                <div>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'red' }} /> {JSON.parse(ride.destination).display_name}
                </div>
              </td>
              <td>{ride.createdAt}</td>
              <td>{(ride.distance * 1.2).toFixed(1)} $</td>
              <td>{getStatus(ride.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phần phân trang */}
      <div className="pagination">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>Đầu</button> 
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{currentPage - 1}</button>

        <span>{currentPage}</span>

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>{currentPage + 1}</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Cuối</button>
      </div>
    </div>
  );
};

export default RecentRide;
