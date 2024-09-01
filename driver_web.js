// Kết nối đến WebSocket endpoint của backend
const socket = new WebSocket('ws://your-backend-url/ws/driver');
const stompClient = Stomp.over(socket);

// Khi kết nối WebSocket được thiết lập
stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);

    // Đăng ký nhận cảnh báo cho tài xế
    stompClient.subscribe('/topic/alert/' + driverId, function(messageOutput) {
        const alertData = JSON.parse(messageOutput.body);
        console.log('Received alert: ', alertData);
        // Hiển thị cảnh báo cho tài xế
        showAlert(alertData);
    });

    // Bắt đầu gửi thông tin vị trí khi WebSocket kết nối thành công
    startTracking();
});

// Khi nhận được thông tin từ server (nếu cần thiết)
socket.onmessage = function(event) {
    console.log('Message from server: ', event.data);
};

// Khi kết nối WebSocket bị đóng
socket.onclose = function(event) {
    console.log('WebSocket connection closed.', event);
    // Thử kết nối lại hoặc thông báo lỗi cho người dùng
    // reconnect();
};

// Khi có lỗi xảy ra
socket.onerror = function(error) {
    console.error('WebSocket error: ', error);
    // Thử kết nối lại hoặc thông báo lỗi cho người dùng
    // reconnect();
};

// Hàm để cập nhật cảnh báo
function showAlert(alertData) {
    // Hiển thị cảnh báo cho tài xế (có thể thay alert bằng UI notification khác)
    alert(`Alert: ${alertData.message}. Speed: ${alertData.speed}`);
}

// Hàm để bắt đầu theo dõi và gửi thông tin vị trí
function startTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            const locationData = {
                driverId: driverId, // Thêm ID tài xế vào dữ liệu vị trí
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: position.timestamp
            };

            // Gửi dữ liệu vị trí qua WebSocket đến backend
            socket.send(JSON.stringify(locationData));
        }, function(error) {
            console.error('Geolocation error: ', error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// (Optional) Hàm để kết nối lại khi có lỗi hoặc mất kết nối
// function reconnect() {
//     // Logic để kết nối lại WebSocket và STOMP client
// }
