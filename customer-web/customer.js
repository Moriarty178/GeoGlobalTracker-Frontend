
var map = L.map('map').setView([21.0285, 105.8542], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let locSourceMarker, locDestinationMarker, routeLayer;

// Hàm đánh dấu vị trí
function markLocation(lat, lon, isSource) {
    if (isSource) {
        // Xóa marker cũ của điểm đón nếu có
        if (locSourceMarker) {
            map.removeLayer(locSourceMarker);
            delete locSourceMarker;
        }
        // Thêm marker mới cho điểm đón
        locSourceMarker = L.marker([lat, lon]).addTo(map).bindPopup('Điểm đón').openPopup();
        localStorage.setItem('loc_source', JSON.stringify({ lat, lon }));

        // Xóa tuyến đường cũ khi thay đổi điểm đón: nếu không thì vẫn sẽ thấy điểm đón cũ BỞI VÌ marker thì đã mất(do xóa ở trên) nhưng route thì vẫn còn đó (route và 2 điểm đón, trả là dộc lập với nhau. Xóa đón trả ko đồng nghĩa xóa được route)
        if (routeLayer) {
            map.removeControl(routeLayer);
        }
    } else {
        // Xóa marker cũ của điểm trả nếu có
        if (locDestinationMarker) {
            map.removeLayer(locDestinationMarker);
            delete locDestinationMarker;
        }
        // Thêm marker mới cho điểm trả
        locDestinationMarker = L.marker([lat, lon]).addTo(map).bindPopup('Điểm trả').openPopup();
        localStorage.setItem('loc_destination', JSON.stringify({ lat, lon }));

        // Xóa tuyến đường cũ khi thay đổi điểm trả
        if (routeLayer) {
            map.removeControl(routeLayer);
        }
    }

    // Kiểm tra và vẽ lại tuyến đường khi cả hai điểm đón và trả đã có
    const storedSource = JSON.parse(localStorage.getItem('loc_source'));
    const storedDestination = JSON.parse(localStorage.getItem('loc_destination'));
    if (storedSource && storedDestination) {
        drawRoute(storedSource, storedDestination);
    }
}

// Hàm vẽ tuyến đường
function drawRoute(source, destination) {
    // Xóa tuyến đường cũ nếu có
    if (routeLayer) {
        map.removeControl(routeLayer);
    }

    // Vẽ tuyến đường mới
    routeLayer = L.Routing.control({
        waypoints: [
            L.latLng(source.lat, source.lon),
            L.latLng(destination.lat, destination.lon)
        ],
        routeWhileDragging: true
    }).addTo(map);
}

window.onload = function () {
    const storedSource = JSON.parse(localStorage.getItem('loc_source'));
    const storedDestination = JSON.parse(localStorage.getItem('loc_destination'));
    if (storedSource) markLocation(storedSource.lat, storedSource.lon, true);
    if (storedDestination) markLocation(storedDestination.lat, storedDestination.lon, false);
    if (storedSource && storedDestination) drawRoute(storedSource, storedDestination);
};


// function searchLocation(query, callback) {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;//dùng api nominatim để đề xuất địa điểm 
//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             if (data && data.length > 0) {
//                 callback(data);
//             }
//         });
// }

function searchLocation(query, callback) {
    const url = `https://photon.komoot.io/api/?q=${query}&limit=5`;//dùng photon cho đề xuất địa điểm 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.features.length > 0) {
                callback(data.features.map(feature => ({
                    display_name: feature.properties.name,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0]
                })));
            }
        });
}




function displaySuggestions(data, suggestionBox, isSource) {
    suggestionBox.innerHTML = '';
    data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        li.textContent = `${item.display_name}`;
        li.addEventListener('click', () => {
            markLocation(item.lat, item.lon, isSource);
            suggestionBox.innerHTML = ''; // Xóa gợi ý khi chọn
        });
        suggestionBox.appendChild(li);
    });
}

const locSourceInput = document.getElementById('loc_source');
const locDestinationInput = document.getElementById('loc_destination');
const sourceSuggestions = document.getElementById('sourceSuggestions');
const destinationSuggestions = document.getElementById('destinationSuggestions');

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

locSourceInput.addEventListener('input', debounce(function () {
    const query = locSourceInput.value;
    if (query.length > 2) {
        searchLocation(query, data => displaySuggestions(data, sourceSuggestions, true));
    }
}, 500)); // 500ms delay

locDestinationInput.addEventListener('input', debounce(function () {
    const query = locDestinationInput.value;
    if (query.length > 2) {
        searchLocation(query, data => displaySuggestions(data, destinationSuggestions, false));
    }
}, 500)); // 500ms delay

// locSourceInput.addEventListener('input', function () {
//     const query = locSourceInput.value;
//     if (query.length > 2) {
//         searchLocation(query, data => displaySuggestions(data, sourceSuggestions, true));
//     }
// });

// locDestinationInput.addEventListener('input', function () {
//     const query = locDestinationInput.value;
//     if (query.length > 2) {
//         searchLocation(query, data => displaySuggestions(data, destinationSuggestions, false));
//     }
// });