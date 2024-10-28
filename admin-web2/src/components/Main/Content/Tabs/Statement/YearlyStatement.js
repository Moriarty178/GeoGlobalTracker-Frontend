import DriverStatement from "../Drivers/ApprovedDrivers/ColOtherAction/DriverStatement";



const YearlyStatement = ({ onSubPageChange }) => {
    return (
        <div>
            <h1>Yearly Ride Statement</h1>
            <DriverStatement
                urlStats={'http://localhost:8080/trips/statement/yearly'}
                urlApiHistory={'http://localhost:8080/trips/statement/yearly-history'}
                onSubPageChange={onSubPageChange}
            />;
        </div>
    );

};

export default YearlyStatement;