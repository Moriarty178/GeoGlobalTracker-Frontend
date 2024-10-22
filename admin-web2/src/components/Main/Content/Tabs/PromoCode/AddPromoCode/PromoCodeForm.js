import { useEffect, useState } from "react";


const PromoCodeForm = ({ initialData, onSubmit, onBack }) => {
    const [name, setName] = useState('');
    const [code, setCodeName] = useState('');
    const [type, setType] = useState('');
    const [value, setValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [expiredDate, setExpiredDate] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // set dữ liệu nếu có initialData(case 'eidt')
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCodeName(initialData.code);
            setType(initialData.type);
            setValue(initialData.value);
            setUsageLimit(initialData.usageLimit);
            setExpiredDate(initialData.expiredDate);
            setStatus(initialData.status);
        }
    }, [initialData]);

    // hàm khi ấn save (both case 'add' & 'edit') -> call onSubmit function class chính
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { name, code, type, value, usageLimit, expiredDate, status };

        setLoading(true);

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>{initialData ? 'Edit Promo Code' : 'Add Promo Code'}</h1>
            <form className="form-content" onSubmit={handleSubmit}>
                <div className="form-buttons">
                    <button onClick={onBack}>Back</button>
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
                    <select value={type} required onChange={(e) => setType(e.target.value)} className="form-select select-custom">
                        <option value="" disabled selected>Choose Type of Promo Code</option>
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
                        value={usageLimit}
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
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required className="form-select select-custom">
                        <option value="" disabled selected>Choose status</option>
                        <option value='active'>active</option>
                        <option value='inactive'>inactive</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-green" disabled={loading}>
                        {loading ? 'Loading' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromoCodeForm;