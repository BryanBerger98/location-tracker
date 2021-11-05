let map;
let lastRouteDistance = 0;
function initMap() {
    navigator.geolocation.getCurrentPosition(
        success => {
            const position = {lat: success.coords.latitude, lng: success.coords.longitude}
            map = new google.maps.Map(document.getElementById("map"), {
              zoom: 18,
              center: position,
              disableDefaultUI: true
            });
            const marker = new google.maps.Marker({
              position: position,
              map: map,
            });
        },
        console.error,
        {enableHighAccuracy: true}
    );
}

const waypoints = [];

function startTracking() {
    document.getElementById('startTrackingBtn').className = 'd-none';
    document.getElementById('stopTrackingBtn').className = "d-block btn btn-danger m-auto";
    navigator.geolocation.watchPosition(
        success => {
            waypoints.push({lat: success.coords.latitude, lng: success.coords.longitude});
        },
        console.error,
        {enableHighAccuracy: true}
    );
}

function stopTracking() {
    document.getElementById('stopTrackingBtn').className = 'd-none';
    document.getElementById('startTrackingBtn').className = "d-block btn btn-primary m-auto";
    snapToRoad(waypoints);
}

function displayDistance(distance) {
    if (distance < 1000) {
        return distance.toFixed(2) + ' m';
    }
    return (distance * 1000).toFixed(2) + ' km';
}

function snapToRoad(waypoints) {
    const wps = waypoints.map(el => el.lat + ',' + el.lng).join('|');
    const request = new XMLHttpRequest();
    request.open('GET', `https://roads.googleapis.com/v1/snapToRoads?path=${wps}&key=AIzaSyChZXDPZZW3HJIBpCtC7cJ6XAk_EGvofwc`, true);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            const pathWaypoints = JSON.parse(request.response).snappedPoints.map(el => {
                console.log(el.location.latitude);
                return new google.maps.LatLng(
                    el.location.latitude,
                    el.location.longitude);
            });
            const lastRoute = new google.maps.Polyline({
                path: pathWaypoints,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            lastRoute.setMap(map);
            lastRouteDistance = google.maps.geometry.spherical.computeLength(lastRoute.getPath().getArray());
            const textDistance = document.getElementById('text-distance');
            textDistance.className = 'd-block text-center';
            textDistance.innerText = displayDistance(lastRouteDistance);
        }
    }
    request.send();
    
}

function saveRouteToFirebase({waypoints, distance, startDate, endDate}) {
    const ref = firebase.database().ref('routes/');
    const newRouteRef = ref.push();
    newRouteRef.set({
        waypoints,
        distance,
        startDate,
        endDate
    });
    
}

document.getElementById('startTrackingBtn').addEventListener('click', startTracking);
document.getElementById('stopTrackingBtn').addEventListener('click', stopTracking);