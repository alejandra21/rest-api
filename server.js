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

function addArray(array, db_element) {

	if (array) {

	    for (var i = 0; i < array.length ; i++) {
	        db_element.push(array[i]);
	    } 
		
	}

}

// on routes that end in /exercises
// ----------------------------------------------------
router.route('/')

	// create a exercise (accessed at POST http://localhost:8080/exercises)
	.post(function(req, res) {
		
		var exercise = new Exercise();

		// create a new instance of the Exercise model
		exercise.name            = req.body.name; 
		exercise.typeExercise    = req.body.typeExercise;
		exercise.mainImage       = req.body.mainImage;
		exercise.levelDifficulty = req.body.levelDifficulty;
		exercise.createdBy       = req.body.createdBy;
		exercise.creationDate    = req.body.creationDate; 
		exercise.status          = req.body.status;

		if (req.body.timer) {
			
			exercise.timer.duration  = req.body.timer.duration;
		}

		// add lights elements to the new instance
		addArray(req.body.lights, exercise.lights);

		// add music elements to the new instance
		addArray(req.body.music, exercise.music);

		// add videoTutor elements to the new instance
		addArray(req.body.videoTutor, exercise.videoTutor);

		exercise.save()
			.then(exercise => { 
				res.json({ message: 'Se ha creado un nuevo elemento en la base de datos' }) 
			})

			.catch(err => res.status(500).send("No se ha ingresado una estructura adecuada."))
		
	})

	// get all the exercises (accessed at GET http://localhost:8080/exercises)
	.get(function(req, res) {
		Exercise.find()
			.then(exercises => { 
				res.json(exercises) 
			})
			
			.catch(err => res.status(500).send("Problemas en el sistema."))
	})

	// update the exercise 
	.put(function(req, res) {

		Exercise.findById(req.body.id)

			.then(exercise => { 

				exercise.name            = req.body.name; 
				exercise.typeExercise    = req.body.typeExercise;
				exercise.mainImage       = req.body.mainImage;
				exercise.levelDifficulty = req.body.levelDifficulty;
				exercise.createdBy       = req.body.createdBy;
				exercise.creationDate    = req.body.creationDate; 
				exercise.status          = req.body.status;

				if (req.body.timer) {
					exercise.timer.duration  = req.body.timer.duration;
				}
				else{
					exercise.timer = {};
				}

				exercise.lights = [];
				exercise.music = [];
				exercise.videoTutor = [];

				// update lights elements to the new instance
				addArray(req.body.lights, exercise.lights);

				// update music elements to the new instance
				addArray(req.body.music, exercise.music);

				// update videoTutor elements to the new instance
				addArray(req.body.videoTutor, exercise.videoTutor);

				exercise.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Ejercicio modificado.' });
				});

			})

			.catch(err => res.status(500).send("Formato de ID incorrecto."))

	});


// ----------------------------------------------------
router.route('/:id')

	// get the exercise with  id
	.get(function(req, res) {
		Exercise.findById(req.params.id)
			.then(exercise => {
				res.json(exercise);
				
			})
			.catch(err => res.status(500).send("Formato de ID incorrecto."))
		
	})

	// delete the exercises with id
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
