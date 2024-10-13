// import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './RiderStatus.css'

const RiderStatus = ({ riderId, status: initialStatus, onSubPageChange }) => {
    const [status, setStatus] = useState(initialStatus || 'Active');

    const handleSave = () => {
        // Gửi request để cập nhật trạng thái của Rider
        axios.put(`http://localhost:8080/trips/riders/${riderId}/status`, { status })
            .then(response => {
                console.log('Status updated:', response.data);
                // Quay lại trang Rider sau khi lưu thành công
                // onSubPageChange(null); // Quay lại trang chính (Rider)
                alert(`${response.data} Changed the status of RiderID ${riderId} -> ${status}`);
            })
            .catch(error => {
                console.error('Error updating rider status:', error);
                // onSubPageChange(null); // Quay lại trang chính (Rider)
            });
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div>
            <h2>Change Status for RiderID: {riderId}</h2>
            <div className='form-buttons'>
                <button type='button' onClick={handleBack}>Back</button>
            </div>
            <div className='form-select-status'>
                <span> Select status:</span>
                <select className='select-status' value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Blocked">Block</option>
                </select>
                <div className='form-buttons'>
                    <button className="btn-green" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default RiderStatus;