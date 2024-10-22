import axios from "axios";
import { useEffect, useState } from "react";
import PromoCodeForm from "./PromoCodeForm";


const EditPromoCode = ({ promoId, onSubPageChange }) => {
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        // fetch lấy dữ liệu cho form
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/promo-code/${promoId}`);
                setInitialData(response.data);
            } catch (error) {
                console.error('Error fetching promo code for edit!');
            }
        };
        fetchDetails();
    }, [promoId]);

    // hàm xử lý khi thay đổi
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    const handleBack = () => {
        onSubPageChange(null);
    };

    const handleSubmit = async (formData) => {
        // e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/trips/promo-code/edit/${promoId}`, formData);
            alert('Edited successfully.');
        } catch (error) {
            console.error('Error editing promo code!', error);
        }
    };

    return (
        <PromoCodeForm initialData={initialData} onSubmit={handleSubmit} onBack={handleBack} />
    );
};

export default EditPromoCode;