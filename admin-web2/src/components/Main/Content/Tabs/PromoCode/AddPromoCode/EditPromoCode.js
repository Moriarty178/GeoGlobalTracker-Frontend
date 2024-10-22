import axios from "axios";
import { useEffect, useState } from "react";


const EditPromoCode = ({ promoId, onSubPageChange }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: '',
        value: '',
        usageLimit: '',
        expiredDate: '',
        status: '',
    });

    useEffect(() => {
        // fetch lấy dữ liệu cho form
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/promo-code/${promoId}`);
                const promoCode = response.data;
                setFormData({
                    name: promoCode.name,
                    code: promoCode.code,
                    type: promoCode.type,
                    value: promoCode.value,
                    usageLimit: promoCode.usageLimit,
                    expiredDate: promoCode.expiredDate,
                    status: promoCode.status,
                });
            } catch (error) {
                console.error('Error fetching promo code for edit!');
            }
        };
        fetchDetails();
    }, [promoId]);

    // hàm xử lý khi thay đổi
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/trips/promo-code/edit/${promoId}`, formData);
        } catch (error) {
            console.error('Error editing promo code!', error);
        }
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div>
            <h1>Edit Promo Code</h1>
            <div className="form-buttons">
                <button onClick={handleBack}>Back</button>
            </div>
            <form className="form-content" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Name Promo Code</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Enter name of promo code"
                        name="name"
                        value={formData.name}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Name Code</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Enter code of promo"
                        name="code"
                        value={formData.code}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Type</label>
                    <select value={formData.type} name="type" onChange={handleInputChange}>
                        <option value="flat">flat</option>
                        <option value="percentage">percentage</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Value</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Value"
                        name="value"
                        value={formData.value}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Usage Limit</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Enter limit usage"
                        name="usageLimit"
                        value={formData.usageLimit}
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Expired Dateb</label>
                    <input className="form-input"
                        type="datetime-local"
                        name="expiredDate"
                        value={formData.expiredDate}
                        required
                        onFocus={(e) => e.target.showPicker()}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={formData.status} name="status" onChange={handleInputChange}>
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-green">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EditPromoCode;