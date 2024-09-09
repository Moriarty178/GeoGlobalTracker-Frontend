// -------------------------------- Loin/Sign up ---------------------------------

// URL của backend API cho đăng nhập và đăng ký
const API_BASE_URL = 'http://localhost:8080/api/auth';//AuthController(BE)

// Hàm đăng nhập
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.text())
    .then(jwt => {
        // if (jwt.startsWith('Bearer ')) {
            localStorage.setItem('jwt', jwt);
            document.getElementById('login-message').textContent = 'Login successful!';
            initializeWebSocket(); // Gọi hàm kết nối WebSocket sau khi đăng nhập thành công
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('signup-form').classList.add('hidden');
            document.getElementById('status').classList.remove('hidden');
            document.getElementById('location').classList.remove('hidden');
            document.getElementById('alerts').classList.remove('hidden');
        // } else {
        //     document.getElementById('login-message').textContent = 'Login failed!';
        // }
        // // console.log(jwt);
    })
    .catch(error => {
        console.error('Error during login:', error);
        document.getElementById('login-message').textContent = 'Login failed!';
    });
}

// Hàm đăng ký
function signup() {
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const phone = document.getElementById('signup-phone').value;

    fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, phone })
    })
    .then(response => response.text())
    .then(message => {
        document.getElementById('signup-message').textContent = message;
        if (message === 'Registered successfully!') {
            document.getElementById('signup-form').classList.add('hidden');
        }
    })
    .catch(error => {
        console.error('Error during signup:', error);
        document.getElementById('signup-message').textContent = 'Signup failed!';
    });
}

//----------------------------- WebSocket sau khi đăng nhập thành công -------------------------------


const locationElement = document.getElementById('location');
let driverId = 5;

// Hàm để khởi tạo WebSocket sau khi đăng nhập thành công
function initializeWebSocket() {

    const statusElement = document.getElementById('status');
    const alertsElement = document.getElementById('alerts');

    // Kết nối đến WebSocket endpoint của backend
    const socket = new WebSocket('ws://localhost:8080/ws/driver');
    const stompClient = new StompJs.Client ({//tạo 1 STOMP client trên kết nối WebSocket
        webSocketFactory: () => socket,
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = function (frame) {
        console.log('Connected: ' + frame);
        statusElement.textContent = 'Status: Connected';

        // Đăng ký nhận cảnh báo cho tài xế
        stompClient.subscribe('/topic/alert/' + driverId, function(messageOutput) {
            const alertData = JSON.parse(messageOutput.body);
            console.log('Received alert: ', alertData);
            alertsElement.textContent = `Alert: ${alertData.message}, Speed: ${alertData.speed}`;
            // Hiển thị cảnh báo cho tài xế tab
            // showAlert(alertData);
        });

        // Bắt đầu gửi thông tin vị trí khi WebSocket kết nối thành công
        startTracking(stompClient);
    };

    // Khi kết nối WebSocket bị đóng
    stompClient.onWebSocketClose = function(event) {
        console.log('WebSocket connection closed.', event);
        statusElement.textContent = 'Status: Disconnected';
        // Thử kết nối lại hoặc thông báo lỗi cho người dùng
        // reconnect();
    };

    //Xử lý khi có lỗi liên quan đến STOPM vd: subcribe, unsubcribe hoặc lỗi tử server khi gửi phản hồi không đúng định dạng STOMP.
    stompClient.onStompError= function(error) {
        console.error('WebSocket error: ', error);
    };

    // //Xử lý khi WebSocket bị lỗi vd: kết nối lại
    // stompClient.onWebSocketError = function(event) {
    //     console.log('WebSocket error: ', event);
    //     // Thử kết nối lại hoặc thông báo lỗi cho người dùng
    //     // reconnect();
    // }

    //Kích hoạt kết nối khi đã thiết lập xong
    stompClient.activate();
}

// Hàm để cập nhật cảnh báo
function showAlert(alertData) {
    // Hiển thị cảnh báo cho tài xế (có thể thay alert bằng UI notification khác)
    alert(`Alert: ${alertData.message}. Speed: ${alertData.speed}`);
}

// Hàm để bắt đầu theo dõi và gửi thông tin vị trí
function startTracking(stompClient) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            const locationData = {
                driverId: driverId, // Thêm ID tài xế vào dữ liệu vị trí
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed,
                timestamp: position.timestamp
            };

            // document.getElementById('location').textContent
            locationElement.textContent = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}, Speed: ${position.coords.speed}, TimeStamp: ${position.timestamp}, DriverID: ${driverId}`;
            // Gửi dữ liệu vị trí qua WebSocket topic đến backend ('MessageMappint('driver-location'))
            stompClient.publish({
                destination: '/app/driver-location',
                body: JSON.stringify(locationData),
            });
        }, function(error) {
            console.error('Geolocation error: ', error);
        }, {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        locationElement.textContent = "Geolocation iss not supported by this browser.";
    }
}

// (Optional) Hàm để kết nối lại khi có lỗi hoặc mất kết nối
// function reconnect() {
//     // Logic để kết nối lại WebSocket và STOMP client
// }




// ---------------------- Gửi yêu cầu service từ front-end ---------------------------
// const jwt1 = localStorage.getItem('jwt');

// fetch(`${API_BASE_URL}/endpoint`, {
//     method: 'GET',
//     headers: {
//         'Authorization': `Bearer ${jwt1}`
//     }
// })
// .then(response => response.json())
// .then(data => {
//     console.log('Data:', data);
// })
// .catch(error => {
//     console.log('Error:', error);
// })