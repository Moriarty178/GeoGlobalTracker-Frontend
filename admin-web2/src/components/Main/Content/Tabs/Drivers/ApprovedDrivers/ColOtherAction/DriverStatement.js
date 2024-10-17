import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DriverStatement.css'
import { faCar, faFlagCheckered, faMapMarkerAlt, faMoneyBillTrendUp, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from "react-csv"; // Thư viện cho CSV
import * as XLSX from 'xlsx'; // Thư viện cho Excel
import jsPDF from 'jspdf'; // Thư viện cho PDF
import 'jspdf-autotable'; // Hỗ trợ bảng trong PDF
import { copyToClipboard } from 'clipboard';
import { constructFromSymbol } from 'date-fns/constants';

const DriverStatement = ({ driverId, onSubPageChange }) => {
    const [trips, setTrips] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTrips, setTotalTrips] = useState(0);
    const [loading, setLoading] = useState(true);
    const tripsPerPage = 10;

    // dữ liệu cho stats
    const [stats, setStats] = useState({
        totalTrips: 0,
        canceledTrips: 0,
        completedTrips: 0,
        revenue: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/drivers/stats/${driverId}`);

                setStats(response.data);
            } catch (error) {
                console.error('Error fetching data stats:', error);
            }
        };

        fetchStats();
    }, []);// thêm [] tránh vòng lặp


    // fetch dữ liệu history 
    useEffect(() => {
        const fetchTripsHistory = async (offset, limit) => {
            try {
                const response = await axios.get(`http://localhost:8080/trips/drivers/history/${driverId}`, {
                    params: {
                        offset: offset,
                        limit: limit,
                    },
                });

                setTrips(response.data.trips);
                setTotalTrips(response.data.total);
                setLoading(false);
            } catch (error) {
                console.error(error.response.data);
                setLoading(false);
            }
        };

        fetchTripsHistory(currentPage - 1, tripsPerPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalTrips / tripsPerPage);

    if (loading) {
        return <h2>Loading...</h2>
    }

    const handleBack = () => {
        onSubPageChange(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Hàm xuất CSV
    const formattedTrips = trips.map(trip => ({ 
        tripId: trip.tripId,
        pickedUp: JSON.parse(trip.source).display_name,
        dropped: JSON.parse(trip.destination).display_name,
        createdAt: trip.createdAt,
        earned: '...',
        status: trip.status
    }));

        // Tạo dữ liệu CSV từ stats và trips
    const csvData = [
        ...formattedTrips.map((trip, index) => ({
            tripId: trip.tripId,
            pickedUp: trip.pickedUp,
            dropped: trip.dropped,
            createdAt: trip.createdAt,
            earned: '...',
            status: trip.status,
            stats: index === 0 ? 'Total Rides' : (index === 1 ? 'Canceled Rides' : (index === 2 ? 'Completed Rides' : (index === 3 ? 'Revenue' : ''))),
            value: index === 0 ? stats.totalTrips : (index === 1 ? stats.canceledTrips : (index === 2 ? stats.completedTrips : (index === 3 ? stats.revenue + " $" : '')))
        })),
    ];

    const csvData2 = [
        // Dữ liệu chuyến đi
        ...formattedTrips,
        // Dòng trống phân cách
        { tripId: '', pickedUp: '', dropped: '', createdAt: '', earned: '', status: '', stats: '', value: '' },
        // Title Statistics
        { tripId: '', pickedUp: '', dropped: '', createdAt: '', earned: '', status: '', stats: '', value: '' },
        // Stats details
        { tripId: '', pickedUp: '', dropped: '', createdAt: '', earned: 'Total Rides', status: stats.totalTrips },
        { tripId: '', pickedUp: '', dropped: '', createdAt: '', earned: 'Canceled Rides', status: stats.canceledTrips },
        { tripId: '', pickedUp: '', dropped: '', createdAt: '', earned: 'Completed Rides', status: stats.completedTrips },
        { tripId: '', pickedUp: '', dropped: '', createdAt: '', earned: 'Revenue', status: stats.revenue + " $" },

    ];

    const csvHeaders = [
        { label: "Trip ID", key: "tripId" },
        { label: "Picked Up", key: "pickedUp" },
        { label: "Dropped", key: "dropped" },
        { label: "Date On", key: "createdAt" },
        { label: "Earned", key: "earned" },
        { label: "Status", key: "status" },
        { label: "Statistic", key: "stats" },
        { label: "Value", key: 'value' }
    ];

    // Hàm xuất Excel
    const excelData = [

        ['Trip ID', 'Picked Up', 'Dropped', 'Date On', 'Earned', 'Status'], // Headers 1
        ...formattedTrips.map(trip => [
            trip.tripId,
            trip.pickedUp,
            trip.dropped,
            trip.createdAt,
            trip.earned,
            trip.status
        ]),
        // Nếu muốn hiển thị history và stats son song thì dùng thêm index, index = [0, 1, 2, 3] ? add : '';
        [null, null, null, null, 'Statistics', null], // Tiêu đề 2
        [null, null, null, null, 'Total No of Ride', stats.totalTrips],
        [null, null, null, null, 'Canceled Ride', stats.canceledTrips],
        [null, null, null, null, 'Completed', stats.completedTrips],
        [null, null, null, null, 'Revenue', stats.revenue + " $"],
        [], // Hàng trống để phân cách 3
        // Các dòn 1, 2, 3 đều tương đương 1 dòng trong bảng.
    ];


    const handleExcelExport = () => {
        const worksheet = XLSX.utils.aoa_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DriverStatement");
        XLSX.writeFile(workbook, `driver-statement_${driverId}.xlsx`);
    };

    // const exportToExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(trips.map(trip => ({
    //         tripId: trip.tripId,
    //         source: JSON.parse(trip.source).display_name,
    //         destination: JSON.parse(trip.destination).display_name,
    //         createdAt: trip.createdAt,
    //         earned: '...',
    //         status: trip.status,
    //     })));
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");
    //     XLSX.writeFile(workbook, `DriverTrips_${driverId}.xlsx`);
    // };

    // Hàm xuất PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Driver Statement", 80, 10);

        // Thêm bảng history
        doc.autoTable({
            // startY: 30,// khoangr cách bắt đầu theo trục tung <=> margin-top
            head: [['Trip ID', 'Picked Up', 'Dropped', 'Date On', 'Earned', 'Status']],
            body: trips.map(trip => [
                trip.tripId,
                JSON.parse(trip.source).display_name,
                JSON.parse(trip.destination).display_name,
                trip.createdAt,
                '...',
                trip.status
            ]),
            // cấu hình độ rộng
            columnStyles: {
                0: { cellWidth: 30 }, // Độ rộng cột Trip ID
                1: { cellWidth: 40 }, // Độ rộng cột Picked Up
                2: { cellWidth: 40 }, // Độ rộng cột Dropped
                3: { cellWidth: 40 }, // Để tự động điều chỉnh chiều rộng cho các cột khác
                4: { cellWidth: 'auto' }, // Độ rộng cột Earned
                5: { cellWidth: 'auto' }  // Độ rộng cột Status
            }
        });

        // Thêm khoảng trống
        doc.text(' ', 10, doc.autoTable.previous.finalY + 10);
        // const finalY = doc.autoTable.previous.finalY + 10;
        // Thêm bảng statistics với kích thước vừa phải và căn chỉnh sang phải
        doc.autoTable({
            head: [['Statistics', 'Value']],
            body: [
                ['Total No of Ride', stats.totalTrips],
                ['Canceled Ride', stats.canceledTrips],
                ['Completed', stats.completedTrips],
                ['Revenue', stats.revenue + " $"]
            ],
            // startY: finalY,
            margin: { left: 130 },  // Căn sang bên phải
            tableWidth: 70,         // Giới hạn độ rộng của bảng để không chiếm toàn bộ trang
        });

        doc.save(`DriverTrips_${driverId}.pdf`);
    };

    // Hàm COPY
    const copyToClipboard = () => {
        const span1 = `Data of DriverID ${driverId} at page ${currentPage}:`

        const text1 = trips.map(trip => `${trip.tripId}\t${JSON.parse(trip.source).display_name}\t${JSON.parse(trip.destination).display_name}\t${trip.createdAt}\t...\t${trip.status}`)
            .join('\n\t');
        
        const line = '--------------------------------------------------------------';
        
        const span2 = `Stats total`;
        const text2 =  `\tTotal Rides: ${stats.totalTrips}\n\tCanceled Rides: ${stats.canceledTrips}\n\tCompleted Rides: ${stats.completedTrips}\n\tRevenue: ${stats.revenue} $`;

        const textFinal = `${span1}\n\t${text1}\n\n${line}\n\n${span2}\n${text2}`;

        navigator.clipboard.writeText(textFinal).then(() => {
            alert("Data copied to clipboard.");
        }).catch(error => {
            console.error('Failed to copy: ', error);
        });
    };

    return (
        <div>
            <div className='statement-header'>
                <h2>Statement</h2>
                <div className="form-stats">
                    <div className="card" style={{ background: '#ff9800' }}>
                        <div className="card-icon bg-n-color-car"> {/* Thên div phụ để padding trong khuôn khổ không bị tràn */}
                            <FontAwesomeIcon className='card-icon-config' icon={faCar} />
                        </div>
                        <div className='card-content'>
                            <h4>Total No of Ride</h4>
                            <span>{stats.totalTrips}</span>
                        </div>
                    </div>

                    <div className="card" style={{ background: '#bc5642' }}>
                        <div className="card-icon bg-n-color-canceled">
                            <FontAwesomeIcon className="card-icon-config" icon={faRectangleXmark} />
                        </div>
                        <div className="card-content">
                            <h4>Canceled Ride</h4>
                            <span>{stats.canceledTrips}</span>
                        </div>
                    </div>

                    <div className="card" style={{ background: '#35cb46' }}>
                        <div className="card-icon bg-n-color-completed">
                            <FontAwesomeIcon className='card-icon-config' icon={faFlagCheckered} />
                        </div>
                        <div className="card-content">
                            <h4>Completed</h4>
                            <span>{stats.completedTrips}</span>
                        </div>
                    </div>

                    <div className="card" style={{ background: '#f631c7' }}>
                        <div className="card-icon bg-n-color-revenue">
                            <FontAwesomeIcon className='card-icon-config' icon={faMoneyBillTrendUp} />
                        </div>
                        <div className="card-content">
                            <h4>Revenue</h4>
                            <span>{stats.revenue} $</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='statement-content'>
                <div className='form-buttons'>
                    <button onClick={handleBack}>Back</button>
                </div>
                <div className='statement-table'>

                    <div className='form-buttons'>
                        <button onClick={copyToClipboard}>Copy</button>
                        <CSVLink data={csvData2} headers={csvHeaders} filename={`DriverTrips_${driverId}.csv`}>
                            <button>CSV</button>
                        </CSVLink>
                        <button onClick={handleExcelExport}>Excel</button>
                        <button onClick={exportToPDF}>PDF</button>
                        <div className='form-search'>
                            <h4>Search:</h4>
                            <input />
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Picked Up</th>
                                <th>Dropped</th>
                                <th>Date On</th>
                                <th>Earned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map(trip => (
                                <tr key={trip.tripId}>
                                    <td>{trip.tripId}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'blue' }} /> {JSON.parse(trip.source).display_name}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'red' }} /> {JSON.parse(trip.destination).display_name}</td>
                                    <td>{trip.createdAt}</td>
                                    <td>............</td>
                                    <td>{trip.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='pagination'>
                    {currentPage !== 1 && (
                        <button onClick={() => handlePageChange(1)}>Đầu</button>
                    )}

                    {currentPage > 2 && (
                        <button onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</button>
                    )}

                    <span>{currentPage}</span>

                    {currentPage < totalPages - 1 && (
                        <button onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</button>
                    )}

                    {currentPage !== totalPages && (
                        <button onClick={() => handlePageChange(totalPages)}>Cuối</button>
                    )}

                </div>
            </div>
        </div >
    );
};

export default DriverStatement;