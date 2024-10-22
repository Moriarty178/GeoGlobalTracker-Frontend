import axios from "axios";
import { useState } from "react";
import './AddPromoCode.css'


const AddPromoCode = ({ onSubPageChange }) => {
    const [name, setName] = useState('');
    const [code, setCodeName] = useState('');
    const [type, setType] = useState('');
    const [value, setValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [expiredDate, setExpiredDate] = useState('');
    const [status, setStatus] = useState('active');

    const handleSubmit = async (e) => {
        e.preventDefault(); // tránh reload trang khi ấn submit

        const formData = { name, code, type, value, usageLimit, expiredDate, status };
        console.log('FORM DATA:', formData);

        try {
            const response = await axios.post('http://localhost:8080/trips/promo-code/add', formData);
            console.log(response.data);
        } catch (error) {
            console.error('Error adding new Promo Code:', error);
        }
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div>
            <h1>Add Promo Code</h1>
            <form className="form-content" onSubmit={handleSubmit}>
                <div className="form-buttons">
                    <button onClick={handleBack}>Back</button>
                </div>

                <div className="form-group">
                    <label className="form-label">Name promo code</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Enter name of promo code"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Code Name</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Enter Code of Promo"
                        value={code}
                        required
                        onChange={(e) => setCodeName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="form-select select-custom">
                        <option value='flat'>flat</option>
                        <option value='percentage'>percentage</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Value</label>
                    <input className="form-input"
                        type="number"
                        placeholder="Value of promo code"
                        value={value}
                        required
                        onChange={(e) => setValue(parseFloat(e.target.value) || '')} // convert -> float -> = '' nếu sai định dạng vd: @, !, `
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Usage Limit</label>
                    <input className="form-input"
                        type="number"
                        placeholder="Enter usage limit"
                        required
                        onChange={(e) => setUsageLimit(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Expired Date</label>
                    <input className="form-input input-custom"
                        type="datetime-local"
                        placeholder="Choose expired date"
                        value={expiredDate}
                        required
                        onChange={(e) => setExpiredDate(e.target.value)}
                        onFocus={(e) => e.target.showPicker()} // hiển thị lịch khi ấn vào input thay vì phải ấn icon lịch
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Select Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select select-custom">
                        <option value='active'>active</option>
                        <option value='inactive'>inactive</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-green">Save</button>
                </div>
            </form>
        </div>
    );
};

export default AddPromoCode;