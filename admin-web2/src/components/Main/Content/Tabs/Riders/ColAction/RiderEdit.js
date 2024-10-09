import axios from "axios";
import { useEffect, useState } from "react";

const RiderEdit = ({ riderId, onSubPageChange }) => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    useEffect(() => {
        const fetchRiderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/riders/${riderId}`);
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
        fetchRiderDetails();
    }, [riderId]);

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
            await axios.put(`http://localhost:8080/trips/riders/${riderId}`, formData);
            alert(`Rider updated successfully with new formData.`);
            // onSubPageChange(null);// quay về trang <Rider />
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
            <h2 className="form-title">Edit Rider</h2>
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
                    <button type="submit" onClick={handleSave}>Save</button>
                    <button type="button" onClick={handleBack}>Back</button>

                </div>
            </form>


        </div>
    );
};

export default RiderEdit;

// const RiderEdit = ({ riderId, onSubPageChange }) => {
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [password, setPassword] = useState('');

//     // hiển thị nội form giống như phần add rider, nhưng các dòng input có thông tin tương ứng với riderId, Admin sửa -> ấn save
//     const [inforRider, setInforRider] = useState();

//     useEffect(() => {
//         fetch(`http://localhost:8080/trips/riders/${riderId}/info`)
//             .then(response => {
//                 setInforRider(response.data);
//                 console.log('Infor of rider:', response.data);
//             })
//             .catch(error => {
//                 console.log('Error get infor rider:', error);
//             });
//     }, []);


//     // Hàm xử lý sau khi Admin sửa lại thông tin và ấn Save
//     const handleSave = () => {
//         const editRider = { phone, email, password, firstName, lastName };

//         axios.post('http://localhost:8080/trips/riders/edit', editRider)
//             .then(response => {
//                 console.log('Rider edited:', response.data);
//                 // onSubPageChange(null); // quay về sau khi ấn save
//             }).catch(error => {
//                 console.error('Error editing:', error);
//             });
//     };

//     // Quay về khi ấn Back
//     const handleBack = () => {
//         onSubPageChange(null);
//     };


//     return (
//         <div className="form-container">
//             <h2 className="form-title">Edit Rider</h2>
//             <form className="form-content">
//                 <div className="form-group">
//                     <label className="form-label">Email:</label>
//                     <input
//                         className="form-input"
//                         type="email"
//                         placeholder="Email"
//                         required
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label className="form-label">Phone:</label>
//                     <input
//                         className="form-input"
//                         type="text"
//                         placeholder="Phone"
//                         required
//                         onChange={(e) => setPhone(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label className="form-label">First Name:</label>
//                     <input
//                         className="form-input"
//                         type="text"
//                         placeholder="First Name"
//                         required
//                         onChange={(e) => setFirstName(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label className="form-label">Last Name:</label>
//                     <input
//                         className="form-input"
//                         type="text"
//                         placeholder="Last Name"
//                         required
//                         onChange={(e) => setLastName(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label className="form-label">Password:</label>
//                     <input
//                         className="form-input"
//                         type="password"
//                         placeholder="Password"
//                         required
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-buttons">
//                     <button type="submit" onClick={handleSave}>Save</button>
//                     <button type="button" onClick={handleBack}>Back</button>

//                 </div>
//             </form>


//         </div>
//     );
// };

// export default RiderEdit;