import React, { useState } from 'react';
import axios from 'axios';
import './AddVehicle.css'
import VehicleTypeForm from './VehicleTypeForm';

const AddVehicleType = ({ onSubPageChange }) => {
    
    const handleBack = () => {
        onSubPageChange(null);
    };

    const handleSubmit = async (formData) => {
        await axios.post('http://localhost:8080/trips/vehicles', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <VehicleTypeForm
            onSubmit={handleSubmit}
            onBack={handleBack}
        />
    );
};

export default AddVehicleType;