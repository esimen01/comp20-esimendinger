var map;
var infoWindow;
var openWindow = false;
var myLoc;
var stops = [
	["Alewife", 42.395428, -71.142483, 21],
	["Davis", 42.39674, -71.121815, 22],
	["Porter Square", 42.3884, -71.11914899999999, 18],
	["Harvard Square", 42.373362, -71.118956, 17],
	["Central Square", 42.365486, -71.103802, 10],
	["Kendall/MIT", 42.36249079, -71.08617653, 13],
	["Charles/MGH", 42.361166, -71.070628, 12],
	["Park Street", 42.35639457, -71.0624242, 15],
	["Downtown Crossing", 42.355518, -71.060225, 14],
	["South Station", 42.352271, -71.05524200000001, 11],
	["Broadway", 42.342622, -71.056967, 8],
	["Andrew", 42.330154, -71.057655, 2],
	["JFK/UMass", 42.320685, -71.052391, 16],
	["Savin Hill", 42.31129, -71.053331, 9],
	["Fields Corner", 42.300093, -71.061667, 1],
	["Shawmut", 42.29312583, -71.06573796000001, 6],
	["Ashmont", 42.284652, -71.06448899999999, 20],
	["North Quincy", 42.275275, -71.029583, 7],
	["Wollaston", 42.2665139, -71.0203369, 3],
	["Quincy Center", 42.251809, -71.005409, 5],
	["Quincy Adams", 42.233391, -71.007153, 4],
	["Braintree", 42.2078543, -71.0011385, 19]
];




function initMap() {
	myLoc = {lat: stops[9][1], lng: stops[9][2]}
	map = new google.maps.Map(document.getElementById("map"), {
		center: myLoc,
		zoom: 12
	});
	infoWindow = new google.maps.InfoWindow({
		content: "nothing"
	});
	myLoc = getMyLocation();
	addMarkers();
	addPolylines();
};

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLoc = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(myLoc);

//			infoWindow.setPosition(myLoc);
//			infoWindow.setContent("Location found!");

			addMyMarker();
		});
	} else {
		alert("Location not found, geolocation not supported.");
	}
	return myLoc;
}

function addMarkers() {
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

	var marker

	for (var i = 0; i < stops.length; i++) {
		var stop = stops[i];
		marker = new google.maps.Marker({
			position: {lat: stop[1], lng: stop[2]},
			map: map,
			icon: icon,
			shape: iconShape,
			title: stop[0],
			zIndex: stop[3]
		});

		(function(marker, i) {
			google.maps.event.addListener(marker, 'click', function() {
				if (openWindow) {
					openWindow.close();
				}
				infoWindow.setContent("click!");
				infoWindow.open(map, marker);
				openWindow = infoWindow;
			});
		})(marker, i);
	}
}

function addMyMarker() {
	var here = {
		url: "location.png",
		size: new google.maps.Size(24, 24),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(12, 23)
	};

	var hereShape = {
		coords: [1, 12,  12, 1,  23, 12,  12, 23],
		type: "poly"
	};

	var hereMarker = new google.maps.Marker({
		position: myLoc,
		map: map,
		icon: here,
		shape: hereShape,
		title: "You are here",
		zIndex: 23
	});


	google.maps.event.addListener(hereMarker, 'click', function() {
		if (openWindow) {
			openWindow.close();
		}
	//	infoWindow.setPosition(hereMarker.position);
		infoWindow.setContent("To MBTA:");
		infoWindow.open(map, hereMarker);
		openWindow = infoWindow;
	});
}

function addPolylines() {
	var alewife_ashmont = [
		{lat: stops[0][1], lng: stops[0][2]},
		{lat: stops[1][1], lng: stops[1][2]},
		{lat: stops[2][1], lng: stops[2][2]},
		{lat: stops[3][1], lng: stops[3][2]},
		{lat: stops[4][1], lng: stops[4][2]},
		{lat: stops[5][1], lng: stops[5][2]},
		{lat: stops[6][1], lng: stops[6][2]},
		{lat: stops[7][1], lng: stops[7][2]},
		{lat: stops[8][1], lng: stops[8][2]},
		{lat: stops[9][1], lng: stops[9][2]},
		{lat: stops[10][1], lng: stops[10][2]},
		{lat: stops[11][1], lng: stops[11][2]},
		{lat: stops[12][1], lng: stops[12][2]},
		{lat: stops[13][1], lng: stops[13][2]},
		{lat: stops[14][1], lng: stops[14][2]},
		{lat: stops[15][1], lng: stops[15][2]},
		{lat: stops[16][1], lng: stops[16][2]}
	];

	var jfk_braintree = [
		{lat: stops[12][1], lng: stops[12][2]},
		{lat: stops[17][1], lng: stops[17][2]},
		{lat: stops[18][1], lng: stops[18][2]},
		{lat: stops[19][1], lng: stops[19][2]},
		{lat: stops[20][1], lng: stops[20][2]},
		{lat: stops[21][1], lng: stops[21][2]}
	];

	var lineAshmont = new google.maps.Polyline({
		path: alewife_ashmont,
		geodesic: true,
		strokeColor: '#c80000',
		strokeOpacity: 1.0,
		strokeWeight: 10
	});

	var lineBraintree = new google.maps.Polyline({
		path: jfk_braintree,
		geodesic: true,
		strokeColor: '#c80000',
		strokeOpacity: 1.0,
		strokeWeight: 10
	});

	lineAshmont.setMap(map);
	lineBraintree.setMap(map);
};