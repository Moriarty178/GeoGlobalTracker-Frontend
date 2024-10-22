import { useState, useEffect } from 'react';
import axios from 'axios';
import './AddVehicle.css'


const VehicleTypeForm = ({ initialData, onSubmit, onBack }) => {
    console.log("initial Data:", initialData);

    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [status, setStatus] = useState('available');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    console.log('name:', name);
    console.log('cost:', cost);
    console.log('initialdstatus:', status);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCost(initialData.cost);
            setStatus(initialData.status);
            setPreviewImage(`http://localhost:8080/images/${initialData.img}`);
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !cost || (!image && !previewImage)) {
            setMessage('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('cost', cost);
        formData.append('status', status);
        if (image) {
            formData.append('image', image);
        }

        setLoading(true);

        try {
            await onSubmit(formData);
            setMessage('Lưu loại xe thành công!');
        } catch (error) {
            setMessage('Có lỗi xảy ra, vui lòng thử lại!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-vehicle-type">
            <h2>{initialData ? 'Edit Vehicle Type' : 'Add Vehicle Type'}</h2>
            <div className='form-buttons'>
                <button onClick={onBack}>Back</button>
            </div>

            {message && <p>{message}</p>}

            <form className='form-content' onSubmit={handleSubmit}>
                <div className='form-enter'>
                    <div className='form-group'>
                        <label className='form-label'>Name</label>
                        <input className='form-input'
                            type='text'
                            placeholder='Name'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Cost (USD-$)</label>
                        <input className='form-input'
                            type='number'
                            placeholder='Cost Per Km'
                            required
                            value={cost}
                            onChange={(e) => setCost(parseFloat(e.target.value) || '')} // convert value -> double, nhập ko hợp lệ: !, .., & a, @ -> value = '' Tránh undefined
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Status:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>
                </div>

                <div className='form-enter'>
                    <div className='form-group'>
                        <label className='form-label'>Image</label>
                        <div
                            className='form-upload-area'
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleImageChange(e);
                            }}
                            onClick={() => document.getElementById('fileInput').click()}
                            style={{
                                border: '2px dashed #ccc',
                                // padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                position: 'relative', // Thêm position relative để căn ảnh preview
                            }}
                        >
                            <input
                                id='fileInput'
                                className='form-img'
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {previewImage ? (
                                <img src={previewImage} alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                    }}
                                />
                            ) : (
                                <p>Drag and drop an image or click to upload</p>
                            )}
                        </div>
                    </div>
                </div>

            </form>
            <div className='form-buttons'>
                <button type='submit' onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Loading' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default VehicleTypeForm;
