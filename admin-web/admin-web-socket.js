// ---------------------------------------sử dụng Google Maps API ---------------------------------
// // Khởi tạo bản đồ và các biến lưu trữ
// let map;
// let markers = {};

// // Hàm khởi tạo bản đồ
// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: { lat: 21.0285, lng: 105.8542 }, // Tâm bản đồ tại Hà Nội (có thể thay đổi)
//     });
// }

// // Khởi tạo bản đồ khi trang được load
// window.onload = initMap;
// /**Khởi tạo stompClient và thiết lập các thông số, connect, onClose, on */
// // Kết nối đến WebSocket endpoint "ws/admin" của backend
// // const socket = new SockJS('ws://localhost:8080/ws/admin');
// const socket = new WebSocket('ws://localhost:8080/ws/admin');
// // Sử dụng kết nối SocketJS để thiết lập một giao thức nhắn tin nâng cao giữa client và server. (admin web - backend)
// // const stompClient1 = Stomp.over(socket);//tạo 1 STOMP client trên kết nối SocketJS-(client này sẽ quản lý tất cả các giao thức STOMP: nhắn tín, pub/sub, topic):
// const stompClient = new StompJs.Client ({//tạo 1 STOMP client trên kết nối WebSocket
//     webSocketFactory: () => socket,
//     debug: function (str) {
//         console.log(str);
//     },
//     reconnectDelay: 5000,
//     heartbeatIncoming: 4000,
//     heartbeatOutgoing: 4000,
// });

// // stompClient.connect({}, function(frame) { //kết nối WebSocket được thiết lập <=> stompClient.activate();
// /*--------------------------------------Thiết lập Các hàm callback: onConnect, onWebSocketClose, onStompError --------------------------------- */
// //Xử lý khi sau khi kết nối
// stompClient.onConnect = function (frame) {
//     console.log('Connected: ' + frame);

//     // Đăng ký nhận thông tin vị trí từ tất cả tài xế
//     stompClient.subscribe('/topic/driver-location', function(messageOutput) {
//         const locationData = JSON.parse(messageOutput.body);
//         console.log('Received location data: ', locationData);

//         // Cập nhật vị trí của tài xế trên bản đồ
//         updateDriverLocationOnMap(locationData);
//     });
// };
// // });

// //Xử lý khi kết nối WebSocket bị đóng
// stompClient.onWebSocketClose = function (event) {
//     console.log("WebSocket connection closed.", event);

//     //Thực hiện hành động khi kết nối bị đóng, ví dụ như thử kết nối lại
//     setTimeout(function () {
//         console.log("Reconnecting...");
//         stompClient.activate(); //Kích hoạt lại kết nối
//     }, 5000); //Đợi 5 giấy trước khi thử kết nối lại.
// }

// //Xử lý khi có lỗi liên quan đến STOPM vd: subcribe, unsubcribe hoặc lỗi tử server khi gửi phản hồi không đúng định dạng STOMP.
// stompClient.onStompError = function(frame) {
//     console.error('Broke reported error: ' + frame.headers['message']);
//     console.error('Additional details: ' + frame.body);
// }

// //Kết nối STOMP sau khi đã thiết lập hoàn tất cấu hình: onConnect, onWebSocketClose, onStompError
// stompClient.activate();// khi gọi hàm này nó sẽ bắt đầu quá trình kết nối với máy chủ (Backend) qua websocket và thiết lập giao thức STOMP.

// // Hàm cập nhật vị trí của tài xế trên bản đồ
// async function updateDriverLocationOnMap(locationData) {
//     const { Marker } = await google.maps.importLibrary("marker");

//     const driverId = locationData.driverId;
//     const latLng = new google.maps.LatLng(locationData.latitude, locationData.longitude);

//     // Nếu đã có marker của tài xế này, cập nhật vị trí của nó
//     if (markers[driverId]) {
//         markers[driverId].setPosition(latLng);
//     } else {
//         // Nếu chưa có, tạo một marker mới
//         markers[driverId] = new Marker({
//             position: latLng,
//             map: map,
//             title: 'Driver ID: ' + driverId,
//         });
//     }

//     // Di chuyển bản đồ tới vị trí mới (có thể tắt đi nếu không muốn tự động di chuyển bản đồ)
//     map.panTo(latLng);
// }




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
}

// Khởi tạo bản đồ khi trang được load
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
