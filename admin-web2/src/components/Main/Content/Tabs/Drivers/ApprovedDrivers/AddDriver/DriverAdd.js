import axios from "axios";
import { useState } from "react";

const DriverAdd = ({onSubPageChange}) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    //Save
    const handleSave = () => {
        const newDriver = {email, phone, firstName, lastName, password};

        axios.post('http://localhost:8080/trips/drivers/add', newDriver)
        .then(response => {
            console.log('Rider added:', response.data);
            alert('Added driver successfully.')
        })
        .catch(error => {
            alert(error.response.data);
        });
    };

    //Back
    const handleBack = () => {
        onSubPageChange(null);
    };

    
    return (
        <div className="form-container">
            <h2>Add Driver</h2>
            <form className="form-content" onSubmit={handleSave}> 
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Enter your first name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Enter your last name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input"
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit">Save</button> 
                    <button type="button" onClick={handleBack}>Back</button> 
                </div>
            </form>
        </div>
    );
};

export default DriverAdd;