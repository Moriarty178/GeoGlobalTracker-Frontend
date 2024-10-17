import React, { useState } from 'react';
import axios from 'axios';
import './AddVehicle.css'

const AddVehicleType = ({ onSubPageChange }) => {
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [status, setStatus] = useState('available'); // Mặc định là 'available'
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Xử lý chọn ảnh từ input
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        } else {
            setPreviewImage(null);
        }

    };

    // Xử lý sự kiện kéo-thả ảnh vào khu vực upload
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImage(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !cost || !image) {
            setMessage('Vui lòng điền đầy đủ thông tin!');
            alert('Thiếu thông tin');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('cost', cost);
        formData.append('status', status);
        formData.append('image', image);

        setLoading(true);

        try {
            await axios.post('http://localhost:8080/trips/vehicles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Thêm loại xe thành công!');
            setName('');
            setCost('');
            setStatus('available');
            setImage(null);
            setPreviewImage(null);
        } catch (error) {
            setMessage('Có lỗi xảy ra, vui lòng thử lại!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        onSubPageChange(null);
    };

    return (
        <div className="add-vehicle-type">
            <h2>Add Vehicle Type</h2>
            <div className='form-buttons'>
                <button onClick={handleBack}>Back</button>
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
                        <label className='form-label'>Cost</label>
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
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('fileInput').click()}
                            style={{
                                border: '2px dashed #ccc',
                                padding: '20px',
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
                                required
                                onChange={handleImageChange}
                                style={{ display: 'none' }} // Ẩn input để chỉ kích hoạt khi click vào vùng này
                            />

                            {/* Hiển thị preview ảnh ngay trong vùng upload */}
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Preview"
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

export default AddVehicleType;