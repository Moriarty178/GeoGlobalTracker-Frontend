import axios from "axios";
import { useState } from "react";


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
        <div>
            <h2>Add New Rider</h2>
            <form>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="button" onClick={handleSave}>Save</button>
                    <button type="button" onClick={handleBack}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default RiderAdd;