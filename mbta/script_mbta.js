var map;
var infoWindow;
var myLoc;
var request = new XMLHttpRequest();

function initMap() {
	var myLoc = {lat: 42.406, lng: -71.119}
	map = new google.maps.Map(document.getElementById("map"), {
		center: myLoc,
		zoom: 11
	});
	infoWindow = new google.maps.InfoWindow({map: map});
	getMyLocation();
	addMarkers(map);
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			var myLoc = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(myLoc);
			console.log(myLoc);

			infoWindow.setPosition(myLoc);
			infoWindow.setContent("Location found!");
		});
	} else {
		alert("Location not found, geolocation not supported.");
	}
}

var stops = [
	["South Station", 42.352271, -71.05524200000001, 11],
	["Andrew", 42.330154, -71.057655, 2],
	["Porter Square", 42.3884, -71.11914899999999, 18],
	["Harvard Square", 42.373362, -71.118956, 17],
	["JFK/UMass", 42.320685, -71.052391, 16],
	["Savin Hill", 42.31129, -71.053331, 9],
	["Park Street", 42.35639457, -71.0624242, 15],
	["Broadway", 42.342622, -71.056967, 8],
	["North Quincy", 42.275275, -71.029583, 7],
	["Shawmut", 42.29312583, -71.06573796000001, 6],
	["Davis", 42.39674, -71.121815, 22],
	["Alewife", 42.395428, -71.142483, 21],
	["Kendall/MIT", 42.36249079, -71.08617653, 13],
	["Charles/MGH", 42.361166, -71.070628, 12],
	["Downtown Crossing", 42.355518, -71.060225, 14],
	["Quincy Center", 42.251809, -71.005409, 5],
	["Quincy Adams", 42.233391, -71.007153, 4],
	["Ashmont", 42.284652, -71.06448899999999, 20],
	["Wollaston", 42.2665139, -71.0203369, 3],
	["Fields Corner", 42.300093, -71.061667, 1],
	["Central Square", 42.365486, -71.103802, 10],
	["Braintree", 42.2078543, -71.0011385, 19]
]

function addMarkers(map) {
	var icon = {
		url: "icon.png",
		size: new google.maps.Size(20, 20),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(10, 10)
	};

	var iconShape = {
		coords: [1, 10,  10, 1,  19, 10,  10, 19],
		type: "poly"
	};
	for (var i = 0; i < stops.length; i++) {
		var stop = stops[i];
		var marker = new google.maps.Marker({
			position: {lat: stop[1], lng: stop[2]},
			map: map,
			icon: icon,
			shape: iconShape,
			title: stop[0],
			zIndex: stop[3]
		});
	}
}