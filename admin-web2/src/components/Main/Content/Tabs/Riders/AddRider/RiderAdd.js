import axios from "axios";
import { useState } from "react";
import './RiderAdd.css'


const RiderAdd = ({ onSubPageChange }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const handleSave = () => {
        const newRider = { phone, email, password, firstName, lastName };

        console.log("newRider ===>", newRider);

        axios.post('http://localhost:8080/trips/riders/add', newRider)
            .then(response => {
                console.log("Rider added: ", response.data);
                onSubPageChange();// quay về trang Riders
            }).catch(error => {
                console.error('Error adding rider:', error);
            });
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Add New Rider</h2>
            <form className="form-content">
                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input 
                        className="form-input"
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone:</label>
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="Phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">First Name:</label>
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="First Name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name:</label>
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="Last Name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input 
                        className="form-input"
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-primary" onClick={handleSave}>Save</button>
                    <button type="button" className="btn-secondary" onClick={handleBack}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default RiderAdd;