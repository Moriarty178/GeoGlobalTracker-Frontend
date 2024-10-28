import DriverStatement from "../Drivers/ApprovedDrivers/ColOtherAction/DriverStatement";

const OverallStatemnent = ({onSubPageChange}) => {
    return (
        <div>
            <h1>Overall Ride Statement </h1>
            <DriverStatement
                urlStats={'http://localhost:8080/trips/statement'}
                urlApiHistory={'http://localhost:8080/trips/statement-history'}
                onSubPageChange={onSubPageChange}
            />;
        </div>
    );
};

export default OverallStatemnent;