// -----------------------------------sử dụng OpenStreetMap (OSM) với Leaflet.js thay vì Google Maps API ---------------------------------------
// Khởi tạo bản đồ và các biến lưu trữ
let map;
let markers = {};

// Hàm khởi tạo bản đồ
function initMap() {
    // Khởi tạo bản đồ với Leaflet.js, sử dụng OpenStreetMap làm tile layer
    map = L.map('map').setView([21.0285, 105.8542], 8); // Tâm bản đồ tại Hà Nội

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Gọi API lấy danh sách tất cả tài xế + vị trí trong mạng lưới GlobalTrackerGeo
    fetch('http://localhost:8080/api/all-driver-location')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                // Duyệt qua danh sách và hiển thị lên bản đồ
                data.forEach(locationData => {
                    if (locationData.driverId && locationData.latitude && locationData.longitude) {
                        updateDriverLocationOnMap(locationData);
                    }
                });
            } else {
                console.error('Unexpected data format:', data);
            }
        })
        .catch(error => console.error('Error fetching driver locations:', error));
}

// Khi trang được load -> call initMap()
window.onload = initMap;

const socket = new WebSocket('ws://localhost:8080/ws/admin');
const stompClient = new StompJs.Client ({
    webSocketFactory: () => socket,
    debug: function (str) {
        console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

// Xử lý khi sau khi kết nối
stompClient.onConnect = function (frame) {
    console.log('Connected: ' + frame);

    // Đăng ký nhận thông tin vị trí từ tất cả tài xế
    stompClient.subscribe('/topic/driver-location', function(messageOutput) {
        const locationData = JSON.parse(messageOutput.body);
        console.log('Received location data: ', locationData);

        // Cập nhật vị trí của tài xế trên bản đồ
        updateDriverLocationOnMap(locationData);
    });

    // Đăng ký nhận thông tin khi tài xế đăng xuất
    stompClient.subscribe('/topic/remove-driver', function(message) {
        const driverId = JSON.parse(message.body);
        console.log('driverId remove:', driverId);
        // console.log('Received info driver logout: ', driverId);

        //Cập nhật lại bản đồ
        removeDriverFromMap(driverId);
    })
};

// Xử lý khi kết nối WebSocket bị đóng
stompClient.onWebSocketClose = function (event) {
    console.log("WebSocket connection closed.", event);

    // Thực hiện hành động khi kết nối bị đóng, ví dụ như thử kết nối lại
    setTimeout(function () {
        console.log("Reconnecting...");
        stompClient.activate(); // Kích hoạt lại kết nối
    }, 5000); // Đợi 5 giấy trước khi thử kết nối lại.
}

stompClient.onStompError = function(frame) {
    console.error('Broke reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
}

stompClient.activate();// Bắt đầu quá trình kết nối với máy chủ (Backend) qua websocket và thiết lập giao thức STOMP.

// Hàm cập nhật vị trí của tài xế trên bản đồ
function updateDriverLocationOnMap(locationData) {
    const driverId = locationData.driverId;
    const latLng = [locationData.latitude, locationData.longitude];

    // Nếu đã có marker của tài xế này, cập nhật vị trí của nó
    if (markers[driverId]) {
        markers[driverId].setLatLng(latLng);
    } else {
        // Nếu chưa có, tạo một marker mới
        markers[driverId] = L.marker(latLng).addTo(map)
            .bindPopup('DriverID: ' + driverId);
    }

    // Di chuyển bản đồ tới vị trí mới (có thể tắt đi nếu không muốn tự động di chuyển bản đồ)
    map.panTo(latLng);
}

// Hàm xóa vị trí của tài xế khỏi bản đồ
function removeDriverFromMap(driverId) {
    // Kiểm tra xem marker của tài xế có tồn tại không
    if (markers[driverId]) {
        // Xóa marker khỏi bản đồ
        map.removeLayer(markers[driverId]);

        // Xóa marker khỏi đối tượng lưu trữ (bộ nhớ)
        delete markers[driverId];

        console.log(`Driver with ID ${driverId} has been removed from the map.`);
    } else {
        console.log(`No marker found for Driver ID ${driverId}`);
    }
}