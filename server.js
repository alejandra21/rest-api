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

function addArray(array, db_element) {

    for (var i = 0; i < array.length ; i++) {
        db_element.push(array[i]);
    } 
    console.log(db_element);
}

// on routes that end in /exercises
// ----------------------------------------------------
router.route('/')

	// create a exercise (accessed at POST http://localhost:8080/exercises)
	.post(function(req, res) {
		
		var exercise = new Exercise();

		// create a new instance of the Exercise model
		exercise.name            = req.body.name;  // set the exercises name (comes from the request)
		exercise.typeExercise    = req.body.typeExercise;
		exercise.mainImage       = req.body.mainImage;
		exercise.levelDifficulty = req.body.levelDifficulty;
		exercise.createdBy       = req.body.createdBy;
		exercise.creationDate    = req.body.creationDate; 
		exercise.status          = req.body.status;
		exercise.timer.duration  = req.body.timer.duration;


		addArray(req.body.lights, exercise.lights);
		addArray(req.body.music, exercise.music);
		addArray(req.body.videoTutor, exercise.videoTutor);

		exercise.save()
			.then(exercise => { 
				res.json({ message: 'Exercise created!' }) 
			})

			.catch(err => res.status(500).send("No se ha ingresado una estructura adecuada."))
		
	})

	// get all the exercises (accessed at GET http://localhost:8080/api/exercises)
	.get(function(req, res) {
		Exercise.find()
			.then(exercises => { 
				res.json(exercises) 
			})
			
			.catch(err => res.status(500).send("Problemas en el sistema."))
	});


// ----------------------------------------------------
router.route('/:id')

	// get the bear with that id
	.get(function(req, res) {
		Exercise.findById(req.params.id)
			.then(exercise => {
				res.json(exercise);
				
			})
			.catch(err => res.status(500).send("Formato de ID incorrecto."))
		
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Exercise.remove({
			_id: req.params.id
		})
			.then(exercise => {
				res.json({ message: 'El elemento se ha eliminado de forma correcta.' });
				
			})
			.catch(err => res.status(500).send("Formato de ID incorrecto."))

	});

// REGISTER OUR ROUTES -------------------------------
app.use('/exercises', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
