// -------------------------------- Loin/Sign up ---------------------------------

// URL của backend API cho đăng nhập và đăng ký
const API_BASE_URL = 'http://localhost:8080/api/auth';//AuthController(BE)
let watchId = null; // Lưu trữ ID theo dõi vị trí

// Hàm đăng nhập
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            const jwt = data.jwt;
            const driverId = data.driverId;

            if (jwt && driverId) {
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('driverId', driverId);//lưu driverId
                document.getElementById('login-message').textContent = 'Login successful!';

                initializeWebSocket(driverId); // Gọi hàm kết nối WebSocket sau khi đăng nhập thành công
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('signup-form').classList.add('hidden');
                document.getElementById('status').classList.remove('hidden');
                document.getElementById('location').classList.remove('hidden');
                document.getElementById('alerts').classList.remove('hidden');
            } else {
                document.getElementById('login-message').textContent = 'Login failed!';
            }
            // console.log(jwt);
        })
        .catch(error => {
            console.error('Error during login:', error);
            document.getElementById('login-message').textContent = 'Login failed!';
        });
}

// window.onload giữ nguyên trạng thái trước khi reload sau khi tải lại trang.

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

// Hàm đăng xuất
function logout() {
    const driverId = localStorage.getItem('driverId');
    fetch(`http://localhost:8080/api/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ driverId })
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('jwt');
                localStorage.removeItem('driverId');

                document.getElementById('login-form').classList.remove('hidden');
                document.getElementById('status').classList.add('hidden');
                document.getElementById('location').classList.add('hidden');
                document.getElementById('alerts').classList.add('hidden');

                console.log('Logout successful');

                if (watchId != null) { // Tắt theo dõi vị trí khi tài xế đăng xuất
                    navigator.geolocation.clearWatch(watchId);
                    watchId = null;
                    console.log("Stopped watching geolocation after logout.");
                }
            }
        })
        .catch(error => console.error('Logout failed:', error));
}

//Sự kiện trước khi thoát hoặc đóng tab
window.addEventListener('beforeunload', function (e) {
    logout();
});




//----------------------------- WebSocket sau khi đăng nhập thành công -------------------------------


const locationElement = document.getElementById('location');

// Hàm để khởi tạo WebSocket sau khi đăng nhập thành công
function initializeWebSocket(driverId) {

    const statusElement = document.getElementById('status');
    const alertsElement = document.getElementById('alerts');

    // Kết nối đến WebSocket endpoint của backend
    const socket = new WebSocket('ws://localhost:8080/ws/driver');
    const stompClient = new StompJs.Client({//tạo 1 STOMP client trên kết nối WebSocket
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
        stompClient.subscribe('/topic/alert/' + driverId, function (message) {
            // const alertData = JSON.parse(messageOutput.body);
            // console.log('Received alert: ', alertData);
            // alertsElement.textContent = `Alert: ${alertData.message}, Speed: ${alertData.speed}`;

            // Hiển thị cảnh báo cho tài xế tab
            // showAlert(alertData);
            // Hiển thị thông tin driverRequest mà Backend gửi đến và cung câp tùy chọn chấp nhận hoặc từ chối
            const driverRequest = JSON.parse(message.body);
            handleDriverRequest(driverRequest);
        });

        // Bắt đầu gửi thông tin vị trí khi WebSocket kết nối thành công
        startTracking(stompClient, driverId);
    };

    // Hàm xử lý driverRequest được backend gửi đến, cung cấp tùy chọn chấp nhận hoặc từ chối
    function handleDriverRequest(driverRequest) {
        // Hiển thị thông tin loc_source, loc_destination và distance cho tài xế
        const requestInfo = `Yêu cầu từ khách hàng:
        Điểm đón: ${driverRequest.loc_source.lat}, ${driverRequest.loc_source.lon}
        Điểm trả: ${driverRequest.loc_destination.lat}, ${driverRequest.loc_destination.lon}
        Khoảng cách: ${driverRequest.distance} km`;

        document.getElementById('request-info').textContent = requestInfo; // Hiển thị thông tin yêu cầu trên giao diện

        // Hiển thị các nút "accept" và "deny" trên giao diện để tài xế lựa chọn
        document.getElementById('accept-button').style.display = 'inline';
        document.getElementById('deny-button').style.display = 'inline';

        // Xử lý khi tài xế ấn nút "accept"
        document.getElementById('accept-button').addEventListener('click', function () {
            sendDriverResponse("accepted"); // Nếu chấp nhận, gửi với status "accepted"
            hideRequestButtons(); // Ẩn nút sau khi đã xử lý
            // alert("Bạn đã chấp nhận yêu cầu."); // Thông báo tài xế
        });

        // Xử lý khi tài xế ấn nút "deny"
        document.getElementById('deny-button').addEventListener('click', function () {
            sendDriverResponse("declined"); // Nếu từ chối, gửi với status "declined"
            hideRequestButtons(); // Ẩn nút sau khi đã xử lý
            // alert("Bạn đã từ chối yêu cầu.");
        });
    }

    // Hàm để ẩn nút và xóa request-info sau khi tài xế đã quyết định
    function hideRequestButtons() {
        document.getElementById('accept-button').style.display = 'none';
        document.getElementById('deny-button').style.display = 'none';
        document.getElementById('request-info').innerHTML = '';
    }

    // Hàm gửi phản hồi của tài xế qua WebSocket đến Backend
    function sendDriverResponse(status) {
        const driverResponse = {
            driverId: driverId,
            status: status
        };
        // Gửi phản hồi của tài xế đến backend
        stompClient.publish({
            destination: '/app/driver-response',
            body: JSON.stringify(driverResponse),
        });
    }

    // Khi kết nối WebSocket bị đóng
    stompClient.onWebSocketClose = function (event) {
        console.log('WebSocket connection closed.', event);
        statusElement.textContent = 'Status: Disconnected';
        // Thử kết nối lại hoặc thông báo lỗi cho người dùng
        // reconnect();
    };

    //Xử lý khi có lỗi liên quan đến STOPM vd: subcribe, unsubcribe hoặc lỗi tử server khi gửi phản hồi không đúng định dạng STOMP.
    stompClient.onStompError = function (error) {
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
function startTracking(stompClient, driverId) {
    if (navigator.geolocation) {

        watchId = navigator.geolocation.watchPosition(function (position) {
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
        }, function (error) {
            console.error('Geolocation error: ', error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
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