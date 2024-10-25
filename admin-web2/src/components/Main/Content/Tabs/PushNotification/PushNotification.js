import { useEffect, useState } from 'react';
import './PushNotification.css'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
export const PushNotification = ({ onSubPageChange }) => {
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [sentTo, setSentTo] = useState('');
    const [message, setMessage] = useState('');

    const notificationsPerPage = 6;

    // fetch dữ liệu notifications
    async function fetchNotifications(offset, limit) {
        try {
            const response = await axios.get('http://localhost:8080/trips/notifications', {
                params: {
                    offset: offset,
                    limit: limit,
                },
            });
            setNotifications(response.data.notifications);
            setTotalNotifications(response.data.total);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching data of Notification History:', error);
        }
    };

    useEffect(() => {
        fetchNotifications(currentPage - 1, notificationsPerPage);
    }, [currentPage]);

    // if (loading) {
    //     return <h2>Loading...</h2>;
    // }

    const totalPages = Math.ceil(totalNotifications / notificationsPerPage);

    const handleBack = () => {
        onSubPageChange(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSubmit = async() => {
        const formData = {notificationId: null, title, sentTo, message, createdAt: null};
        try {
            await axios.post('http://localhost:8080/trips/notifications/send', formData);
            alert('Sending notification successfylly.');
            setTitle('');
            setSentTo('');
            setMessage('');
        } catch (error) {
            console.error('Error sending new notification:', error);
        }

        fetchNotifications(currentPage - 1, notificationsPerPage);
    };

    return (
        <div>
            <h1>Push Notification</h1>
            <div className='notifications-header'>
                {/* <h4>Push Notification</h4> */}
                <div className="form-buttons">
                    <button>Back</button>
                </div>
            </div>
            <form className="form-content form-content-custom" onSubmit={handleSubmit}>
                <div className="form-group form-group-custom">
                    <label className="form-label form-label-custom">Title</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group form-group-custom">
                    <label className="form-label form-label-custom">Sent To</label>
                    <select className="form-select" value={sentTo} onChange={(e) => setSentTo(e.target.value)} required>
                        <option value="" disabled selected>Select who cant seen this message</option>
                        <option value="All Riders & Drivers">All Riders & Drivers</option>
                        <option value="All Riders">All Riders</option>
                        <option value="All Drivers">All Drivers</option>
                    </select>
                </div>
                <div className="form-group form-group-custom">
                    <label className="form-label form-label-custom">Push Message</label>
                    <input className="form-input"
                        type="text"
                        placeholder="Message"
                        value={message}
                        required
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className='form-buttons'>
                    <button type='submit' className='btn-green'>Send</button>
                </div>
            </form>
            <div className='statement-content'>
                <h4 style={{ padding: '10px 20px', backgroundColor: '#e0e0e0' }}>Notification History</h4>
                <div className='form-buttons'>
                    <button>Copy</button>
                    <button>CSV</button>
                    <button>Excel</button>
                    <button>PDF</button>
                    <div className='form-search'>
                        <div className='input-container'>
                            <input />
                            <FontAwesomeIcon className='search-icon' icon={faSearch} />
                        </div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Notification ID</th>
                            <th>Title</th>
                            <th>Sent To</th>
                            <th>Message</th>
                            <th>Sent Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification, index) => (
                            <tr key={notification.notificationId}>
                                <td>{(currentPage - 1) * notificationsPerPage + index + 1}</td>
                                <td>{notification.notificationId}</td>
                                <td>{notification.title}</td>
                                <td>{notification.sentTo}</td>
                                <td>{notification.message}</td>
                                <td>{notification.createdAt}</td>
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
    );
};

