import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Client as StompJsClient } from '@stomp/stompjs';

// const customMarkerIcon = new L.Icon({
//     iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // URL của biểu tượng marker mặc định
//     iconSize: [25, 41], // Kích thước biểu tượng
//     iconAnchor: [12, 41], // Điểm neo của biểu tượng (giữa phần đáy của biểu tượng)
//     popupAnchor: [1, -34], // Điểm neo của popup so với biểu tượng
//     shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', // Đường dẫn tới bóng của biểu tượng
//     shadowSize: [41, 41], // Kích thước bóng
// });

const carMarkerIcon = new L.Icon({
    iconUrl: 'http://localhost:8080/images/car-icon.png', // Đường dẫn tới hình xe ô tô
    iconSize: [100, 100], // Kích thước biểu tượng
    iconAnchor: [25, 50], // Điểm neo của biểu tượng (giữa phần đáy của biểu tượng)
    popupAnchor: [0, -50], // Điểm neo của popup so với biểu tượng
});

const GodsView = () => {
    const mapRef = useRef(null);
    const markersRef = useRef({}); // Dùng để lưu trữ các marker

    // Hàm khởi tạo bản đồ
    const initMap = () => {
        if (!mapRef.current) {  // Kiểm tra nếu map chưa được khởi tạo
            mapRef.current = L.map('map').setView([21.0285, 105.8542], 8);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapRef.current);

            // Gọi API lấy danh sách tất cả tài xế và vị trí ban đầu
            fetch('http://localhost:8080/api/all-driver-location')
                .then(response => response.json())
                .then(data => {
                    data.forEach(locationData => {
                        if (locationData.driverId && locationData.latitude && locationData.longitude) {
                            updateDriverLocationOnMap(locationData);
                        }
                    });
                })
                .catch(error => console.error('Error fetching driver locations:', error));
        }
    };

    // Hàm cập nhật vị trí của tài xế trên bản đồ
    const updateDriverLocationOnMap = (locationData) => {
        const { driverId, latitude, longitude } = locationData;
        const latLng = [latitude, longitude];

        if (markersRef.current[driverId]) {
            markersRef.current[driverId].setLatLng(latLng);
        } else {
            markersRef.current[driverId] = L.marker(latLng, { icon: carMarkerIcon }).addTo(mapRef.current)
                .bindPopup(`DriverID: ${driverId}`);
        }

        mapRef.current.panTo(latLng);
    };

    // Hàm xóa tài xế khỏi bản đồ
    const removeDriverFromMap = (driverId) => {
        if (markersRef.current[driverId]) {
            mapRef.current.removeLayer(markersRef.current[driverId]);
            delete markersRef.current[driverId];
        }
    };

    useEffect(() => {
        initMap();  // Khởi tạo bản đồ khi component mount

        // Thiết lập WebSocket và STOMP client
        const socket = new WebSocket('ws://localhost:8080/ws/admin');
        const stompClient = new StompJsClient({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = () => {
            // Đăng ký nhận dữ liệu vị trí tài xế
            stompClient.subscribe('/topic/driver-location', (messageOutput) => {
                const locationData = JSON.parse(messageOutput.body);
                console.log('Received location data:', locationData);

                updateDriverLocationOnMap(locationData);
            });

            // Đăng ký nhận sự kiện tài xế đăng xuất
            stompClient.subscribe('/topic/remove-driver', (messageOutput) => {
                const driverId = JSON.parse(messageOutput.body);
                removeDriverFromMap(driverId);
            });
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();  // Hủy kích hoạt WebSocket khi component unmount
        };
    }, []);

    return (
        <div>
            <h1>God's View</h1>
            <div id="map" style={{ height: '900px', width: '100%' }}></div>
        </div>
    );
};

export default GodsView;
