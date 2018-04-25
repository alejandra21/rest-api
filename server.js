// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/restApi'); // connect to our database

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('openUri', function() {
  console.log("DB connection alive");
});

// Exercise models lives here
var Exercise     = require('./app/models/exercise');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// on routes that end in /exercises
// ----------------------------------------------------
router.route('/')

	// create a exercise (accessed at POST http://localhost:8080/exercises)
	.post(function(req, res) {
		
		var exercise = new Exercise();		// create a new instance of the Exercise model
		exercise.name            = req.body.name;  // set the exercises name (comes from the request)
		exercise.typeExercise    = req.body.typeExercise;
		exercise.mainImage       = req.body.mainImage;
		exercise.levelDifficulty = req.body.levelDifficulty;
		exercise.createdBy       = req.body.createdBy;
		exercise.creationDate    = req.body.creationDate; 
		exercise.status          = req.body.status; 

		console.log(req.body);
		exercise.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Exercise created!' });
		});

		
	})

	// get all the exercises (accessed at GET http://localhost:8080/api/exercises)
	.get(function(req, res) {
		Exercise.find(function(err, exercises) {
			if (err)
				res.send(err);

			res.json(exercises);
		});
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/exercises', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
