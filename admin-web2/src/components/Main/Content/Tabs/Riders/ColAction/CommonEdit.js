import axios from "axios";
import { useEffect, useState } from "react";

const CommonEdit = ({ title, apiUrl, editId, onSubPageChange }) => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(apiUrl + `/${editId}`);
                const rider = response.data;

                //Điền thông tin vào các các trường input(formData-> inputs)
                setFormData({
                    email: rider.email,
                    phone: rider.phone,
                    firstName: rider.firstName,
                    lastName: rider.lastName,
                    password: '', // không hiển thị lại password
                });
            } catch (error) {
                console.log('Error fetching rider details:', error);
            }
        };

        // gọi hàm để lấy dữ liệu rider cho form edit
        fetchDetails();
    }, [editId]);

    // Hàm xử lý khi thay đổi các trường input
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Xử lý lưu thay đổi sau khi ấn nút Save
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put(apiUrl + `/edit/${editId}`, formData);
            alert(`Rider updated successfully with new formData.`);
        } catch (error) {
            console.error('Error updating rider:', error);
        }
    }

    // Quay về khi ấn Back
    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">{title}</h2>
            <form className="form-content" onSubmit={handleSave}>
                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                        className="form-input"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone:</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Phone"
                        name="phone"
                        value={formData.phone}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">First Name:</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name:</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input
                        className="form-input"
                        type="password"
                        placeholder="Enter Your Password if you want to change"
                        name="password"
                        value={formData.password}
                        required
                        onChange={handleInputChange}
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

export default CommonEdit;