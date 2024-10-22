import axios from "axios";
import './AddPromoCode.css'
import PromoCodeForm from "./PromoCodeForm";


const AddPromoCode = ({ onSubPageChange }) => {
    const handleBack = () => {
        onSubPageChange(null);
    };

    const handleSubmit = async (formData) => {
        // e.preventDefault(); // tránh reload trang khi ấn submit

        try {
            const response = await axios.post('http://localhost:8080/trips/promo-code/add', formData);
            alert('Added successfully new promo code.');
            // console.log(response.data);
        } catch (error) {
            console.error('Error adding new Promo Code:', error);
        }
    };

    return (
        <PromoCodeForm onSubmit={handleSubmit} onBack={handleBack} />
    );
};

export default AddPromoCode;