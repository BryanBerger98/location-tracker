let trackingStatus = false;

// const waypoints = [];
const waypoints = [
    L.LatLng(48.853224, 2.403283),
    L.LatLng(48.853264, 2.403372),
    L.LatLng(48.853283, 2.403450),
    L.LatLng(48.853306, 2.403525),
    L.LatLng(48.853310, 2.403587),
    L.LatLng(48.853321, 2.403635)
];
const myMap = L.map('mapid', {attributionControl: false});

myMap.locate({setView: true, enableHighAccuracy:true})
.on('locationfound', e => {
    const radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(myMap);
    L.circle(e.latlng, radius).addTo(myMap);
}).on('locationerror', error => {
    console.error(error);
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 22,
    maxNativeZoom: 22,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYnJ5YW5iZXJnZXIiLCJhIjoiY2t1dHVmcGV6M2VyZTJ3bzZlbGFqdXhtYiJ9.4X4rCNbG2QiEOD3pdV_6VA'
}).addTo(myMap);

// const routeControl = L.Routing.control({
//     waypoints: [
//         L.latLng(48.853224, 2.403283),
//         L.latLng(48.853321, 2.403635)
//     ]
// });

// routeControl.addTo(myMap);
// console.log('Plan >>>', routeControl.getPlan())
// console.log('Router >>>', routeControl.getRouter())


function startTracking() {
    trackingStatus = true;
    alert('Tracking started');
    document.getElementById('startTrackingBtn').className = 'd-none';
    document.getElementById('stopTrackingBtn').className = 'btn btn-danger m-auto d-block';
    myMap.locate({setView: true, watch: true, enableHighAccuracy:true}).on('locationfound', e => {
        const radius = e.accuracy / 2;
        waypoints.push(e.latlng);
        // console.log(waypoints);
        // const distance = waypoints && waypoints.length > 1 ? myMap.distance(waypoints[0], waypoints[1]) : null;
        // console.log(distance, 'meters');
        L.marker(e.latlng).addTo(myMap);
        // .bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(myMap);
    }).on('locationerror', error => {
        console.error(error);
    });
}

function stopTracking() {
    document.getElementById('stopTrackingBtn').className = 'd-none';
    document.getElementById('startTrackingBtn').className = 'btn btn-primary m-auto d-block';
    trackingStatus = false;
    myMap.stopLocate();
    L.Routing.plan(waypoints, {
        addWaypoints: false,
        draggableWaypoints: false
    }).addTo(myMap);
}

document.getElementById('startTrackingBtn').addEventListener('click', startTracking);
document.getElementById('stopTrackingBtn').addEventListener('click', stopTracking);
