import axios from "axios";
import { useEffect, useState } from "react";



const DriverEdit = ({ driverId, onSubPageChange }) => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    useEffect(() => {
        const fetchDriverDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/drivers/${driverId}`);

                const driver = response.data;

                setFormData({
                    email: driver.email,
                    phone: driver.phone,
                    firstName: driver.firstName,
                    lastName: driver.lastName,
                    password: '',
                });
            } catch (error) {
                console.log('Error fetcing driver detail:', error);
            }
        }

        fetchDriverDetail();
    }, [driverId]);

    // hàm xử lý khi thay đổi các trường input -> cập nhật lại formData lúc đầu fetch lên
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Hảm xử lý sau khi ấn Save
    const handleSave = async (e) => {
        try {
            await axios.put(`http://localhost:8080/trips/drivers/${driverId}`, formData);
            alert('Driver updated successfully with new formData.')
        } catch (error) {
            console.error('Error updating driver:', error);
        }
    };

    const handleBack = () => {
        onSubPageChange(null);
    }

    return (
        <div className="form-container">
            <form className="form-content">
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input"
                        type="email"
                        placeholder="Email"
                        name="email"
                        required /**phần có name để gán gia trị mới khi thay đổi */
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input"
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input"
                        type="password"
                        placeholder="Enter your password if you want to change"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" onClick={handleSave}>Save</button>
                    <button type="button" onClick={handleBack}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default DriverEdit;