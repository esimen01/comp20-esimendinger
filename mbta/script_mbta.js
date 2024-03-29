// Edward Simendinger
// MBTA Red Line interactive map javascript
// 21 October 2016

var map;
var infoWindow;
var openWindow = false;		// is there an infowindow open?
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
var closestStation;
var closestLine = false;
var minIdx;
var minDist = 1000000;
var request = new XMLHttpRequest();
var trains = false;
var schedule;

// build basic map
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
};

// use geolocator to find your location
function getMyLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLoc = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(myLoc);

			addMyMarker();
			findClosestStation();
			addPolylines();
		});
	} else {
		alert("Location not found, geolocation not supported.");
	}
	return myLoc;
}

// add red lines between all the stops
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

	closestLine = new google.maps.Polyline({
		path: [myLoc, {lat: stops[minIdx][1], lng: stops[minIdx][2]}],
		geodesic: true,
		strokeColor: '#0077ff',
		strokeOpacity: 1.0,
		strokeWeight: 10
	});

	closestLine.setMap(map);
};

// add marker/listener at your location
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

	google.maps.event.addListener(hereMarker, "click", function() {
		if (openWindow) {
			openWindow.close();
		}
		infoWindow.setContent("The closest Red Line station to you is " +
			closestStation[0] + ", at " + closestStation[1] + " miles away.");
		infoWindow.open(map, hereMarker);
		openWindow = infoWindow;
	});
}

// determine which station is closest to you
function findClosestStation() {
	for (i = 0; i < stops.length; i++) {
		var dist = haversine(toRadians(myLoc.lat), toRadians(myLoc.lng),
							toRadians(stops[i][1]), toRadians(stops[i][2]));
		if (dist < minDist) {
			minDist = dist;
			minIdx = i;
		}
	}

	closestStation = [stops[minIdx][0], Math.round(minDist * 1000) / 1000];
};

// convert degrees (lat, lng) to radians for calculations
function toRadians(x) {
	return x * Math.PI / 180;
}

// based on stack overflow: 
// http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
// find the distance (in miles) between two (lat, lng) points
function haversine(lat1, lng1, lat2, lng2) {
	var distLat = lat2 - lat1;
	var distLng = lng2 - lng1;
	var a = Math.sin(distLat / 2) * Math.sin(distLat / 2) +
			Math.cos(lat1) * Math.cos(lat2) *
			Math.sin(distLng / 2) * Math.sin(distLat / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = 6371 * c;

	return d;
}

// add T stop markers
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
			google.maps.event.addListener(marker, "click", function() {
				if (openWindow) {
					openWindow.close();
				}
				getApiData(marker, i, function(data) {
					if (trains != false) {
						trainInfo(marker, i);
						infoWindow.open(map, marker);
						openWindow = infoWindow;
					}
				});
			});
		})(marker, i);
	}
}

// retrieve MBTA JSON data from herokuapp
function getApiData(marker, i, callback) {
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			if (request.responseText != "" && (request.responseText)) {
				trains = JSON.parse(request.responseText);
				callback(request.responseText); // data was found
			} else {
				callback(false); // no response yet, try again
			}
		} else if (request.status === 404) {	// data was not found
			if (openWindow) {
				openWindow.close();
			}
			infoWindow.setContent("404: Try again!");
			infoWindow.open(map, marker);
			openWindow = infoWindow;
			return;
		}
	}
	request.open("get", "https://aqueous-beyond-90325.herokuapp.com/redline.json", true);
	request.send();
};

// get data on all trains that will arrive at a given station
function trainInfo(marker, i) {
	schedule = [];
	if (request.readyState == 4 && request.status == 200) {
		trains = JSON.parse(request.responseText);
		for (var i = 0; i < trains.TripList.Trips.length; i++) {
			for (var j = 0; j < trains.TripList.Trips[i].Predictions.length; j++) {
				if(trains.TripList.Trips[i].Predictions[j].Stop == marker.title) {
					var time = trains.TripList.Trips[i].Predictions[j].Seconds;
					var dest = trains.TripList.Trips[i].Destination;
					schedule.push({time, dest});	// collect station times and destinations
				}
			}
		}
	}
	if (openWindow) {
		openWindow.close();
	}
	infoWindow.setContent(formatSchedule(marker, schedule));  // make schedule
	infoWindow.open(map, marker);
	openWindow = infoWindow;
}

// convert the given array into an HTML string
function formatSchedule(marker, schedule) {
	schedule = schedule.sort(byTime);	// sort so it's ordered by dest, then time
	schedule = schedule.sort(byDest);
	var text = "<p>" + marker.title + " Station Schedule:</p>";
	for (var i = 0; i < schedule.length; i++) {		// assemble text
		text += "\n <p>There is a train headed to " + schedule[i].dest +
				" arriving in " + formatTime(schedule[i].time) + ".</p>";
	}
	return text;
}

// sort array by time parameter
function byTime(a, b) {
	if (a.time < b.time) {
		return -1;
	} else if (a.time > b.time) {
		return 1;
	} else {
		return 0;
	}
}

// sort array by dest parameter
function byDest(a, b) {
	if (a.dest < b.dest) {
		return -1;
	} else if (a.dest > b.dest) {
		return 1;
	} else {
		return 0;
	}
}

// convert seconds to minutes, seconds with formatting
function formatTime(seconds) {
	min = parseInt(seconds / 60);
	sec = seconds % 60;
	if (min == 1) {
		if (sec == 1) {
			return min + " minute and " + sec + " second";
		} else if (sec == 0) {
			return min + " minute";
		} else {
			return min + " minute and " + sec + " seconds";
		}
	} else if (min == 0) {
		if (sec == 1) {
			return sec + " second";
		} else if (sec == 0) {
			return "no time at all!";
		} else {
			return sec + " seconds";
		}
	} else {
		if (sec == 1) {
			return min + " minutes and " + sec + " second";
		} else if (sec == 0) {
			return min + " minutes";
		} else {
			return min + " minutes and " + sec + " seconds";
		}
	}
}
