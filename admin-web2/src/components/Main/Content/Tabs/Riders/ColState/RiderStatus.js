// import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const RiderStatus = ({ riderId, status: initialStatus, onSubPageChange }) => {
    const [status, setStatus] = useState(initialStatus || 'Active');

    const handleSave = () => {
        // Gửi request để cập nhật trạng thái của Rider
        axios.post(`http://localhost:8080/trips/riders/${riderId}/status`, { status })
            .then(response => {
                console.log('Status updated:', response.data);
                // Quay lại trang Rider sau khi lưu thành công
                // onSubPageChange(null); // Quay lại trang chính (Rider)
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
            <h2>Change Status for Rider {riderId}</h2>
            <div className='form-buttons'>
                <button type='button' onClick={handleBack}>Back</button>
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Block">Block</option>
            </select>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default RiderStatus;