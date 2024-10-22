import { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleTypeForm from './VehicleTypeForm';

const EditVehicleType = ({ vehicleId, onSubPageChange }) => {
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchVehicleData = async () => {
            const response = await axios.get(`http://localhost:8080/trips/vehicles/${vehicleId}`);
            setInitialData(response.data);
        };
        
        fetchVehicleData();
    }, [vehicleId]);

    const handleBack = () => {
        onSubPageChange(null);
    };

    const handleSubmit = async (formData) => {
        await axios.put(`http://localhost:8080/trips/vehicles/${vehicleId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <VehicleTypeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onBack={handleBack}
        />
    );
};

export default EditVehicleType;
