var express = require('express');
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + '/public'));


app.all('*', function(request, response, next) {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Methods', 'GET, POST');
	response.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

var mongoURI = process.env.MONGODB_URI || process.env.MONGOLAB_URI 
	|| process.env.MONGOHQ_URL || 'mongodb://localhost/2048';
var MongoClient = require('mongodb').MongoClient, format = require('util').format
var db = MongoClient.connect(mongoURI, function(error, databaseConnection) {
	db = databaseConnection;
});



app.get('/', function(request, response, next) {
	var toSend = "<!DOCTYPE HTML><html><head><title>2048 Game Center</title></head>"
					+ "<body><h1>2048 Game Center</h1><table><tr><th>User</th><th>Score</th><th>Timestamp</th></tr>";

  	db.collection("scores").find().sort({ score: -1 }).toArray(function(err, curs) {
		if (!err) {
			for (var count = 0; count < curs.length; count++) {
				toSend += "<tr><td>" + curs[count].username
						+ "</td><td>" + curs[count].score
						+ "</td><td>" + curs[count].created_at
						+ "</td></tr>";
			}
			toSend += "</table></body></html>";
			response.send(toSend);
		} else {
			response.send("ERROR");
		}
	});
});



app.post('/submit.json', function(request, response, next) {
	var username = request.body.username;
	var score = parseInt(request.body.score);
	var grid = request.body.grid;

	if (username == "" || score == "" || grid == "") {
		response.send(404);
		return;
	}

	var toInsert = {
		"username" : username,
		"score" : score,
		"grid" : grid,
		"created_at" : Date()
	};

	db.collection('scores').insert(toInsert, function(error, saved) {
		if (error) {
			console.log(error);
			response.send(500);
		} else {
			response.send(200);
		}
	});
});



app.get('/scores.json', function(request, response, next) {
	var user = request.query.username;
  	var userScores = [];
  	db.collection("scores").find().sort({ score: -1 }).toArray(function(err, curs) {
		if (!err) {
			for (var count = 0; count < curs.length; count++) {
				if (user == null || user == curs[count].username) {
					userScores.push(curs[count]);
				}
			}
			response.send(userScores);
		} else {
			response.send("ERROR");
		}
	});
});

app.listen(process.env.PORT || 3000, '0.0.0.0');