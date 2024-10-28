import DriverStatement from "../Drivers/ApprovedDrivers/ColOtherAction/DriverStatement";



const TodayStatement = ({onSubPageChange}) => {
    return (
        <div>
            <h1>Today Ride Statement</h1>
            <DriverStatement
                urlStats={'http://localhost:8080/trips/statement/today'}
                urlApiHistory={'http://localhost:8080/trips/statement/today-history'}
                onSubPageChange={onSubPageChange}
            />;
        </div>
    );
};

export default TodayStatement;