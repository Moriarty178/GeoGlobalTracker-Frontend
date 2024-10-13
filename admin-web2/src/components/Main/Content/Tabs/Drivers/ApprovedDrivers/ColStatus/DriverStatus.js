import axios from "axios";
import { useState } from "react";

const DriverStatus = ({ driverId, status: initialStatus, onSubPageChange }) => {
    const [status, setStatus] = useState(initialStatus || 'Approved');

    const handleSave = () => {
        axios.put(`http://localhost:8080/trips/drivers/${driverId}/status`, {status})
        .then(response => {
            alert(`${response.data}: Changed the status of DriverID ${driverId} -> ${status}`);
        })
        .catch(error => {
            console.error('Error changing Driver status:', error.response.data);
            alert(error.response.data);
        });
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div>
            <h2>Status of {driverId}</h2>
            <div className="form-buttons">
                <button type="button" onClick={handleBack}>Back</button>
            </div>
            <div className="form-select-status">
                <span>Choose Status</span>
                <select className="select-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Approved">Approved</option>
                    <option value="Blocked">Block</option>
                </select>
                <div className="form-buttons">
                    <button className="btn-green" type="button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default DriverStatus;