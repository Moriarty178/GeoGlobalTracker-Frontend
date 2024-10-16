// import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './RiderStatus.css'

const CommonStatus = ({ title, apiUrl, statusId, status: initialStatus, onSubPageChange }) => {
    const [status, setStatus] = useState(initialStatus || 'Approved');

    const handleSave = () => {
        axios.put(apiUrl + `/status/${statusId}`, { status }) // {status}: vì nó phải là object mà hiện tại đang là biến đơn => dùng {} để thành object.
            .then(response => {
                console.log('Status updated:', response.data);
                alert(`${response.data} Changed the status of RiderID ${statusId} -> ${status}`);
            })
            .catch(error => {
                console.error('Error updating rider status:', error);
            });
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div>
            <h2>Change Status for {title}: {statusId}</h2>
            <div className='form-buttons'>
                <button type='button' onClick={handleBack}>Back</button>
            </div>
            <div className='form-select-status'>
                <span> Select status:</span>
                <select className='select-status' value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Approved">Approved</option>
                    <option value="Blocked">Block</option>
                </select>
                <div className='form-buttons'>
                    <button className="btn-green" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default CommonStatus;