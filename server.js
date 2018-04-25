// BASE SETUP
// =============================================================================

// call the packages we need
var express       = require('express');
var bodyParser    = require('body-parser');
var app           = express();
var morgan        = require('morgan');
var autoIncrement = require('mongoose-auto-increment');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose   = require('mongoose');
var connection = mongoose.connect('mongodb://127.0.0.1:27017/restApi'); // connect to our database


autoIncrement.initialize(connection);

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
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

function setDBelements(exercise,request){

	// excercise: is the new db instance
	// request  : is the info that de user has sent

	exercise.name            = request.name; 
	exercise.typeExercise    = request.typeExercise;
	exercise.mainImage       = request.mainImage;
	exercise.levelDifficulty = request.levelDifficulty;
	exercise.createdBy       = request.createdBy;
	exercise.creationDate    = request.creationDate; 
	exercise.status          = request.status;


	// add lights elements to the new instance
	addArray(request.lights, exercise.lights);

	// add music elements to the new instance
	addArray(request.music, exercise.music);

	// add videoTutor elements to the new instance
	addArray(request.videoTutor, exercise.videoTutor);

}

// on routes that end in /exercises
// ----------------------------------------------------
router.route('/')

	// create a exercise (accessed at POST http://localhost:8080/exercises)
	.post(function(req, res) {
		
		// create a new instance of the Exercise model
		var exercise = new Exercise();

		// Set DB elements
		setDBelements(exercise,req.body);

		// Set timer
		if (req.body.timer) {
			
			exercise.timer.duration  = req.body.timer.duration;
		}

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

	// update the exercise (accessed at PUT http://localhost:8080/exercises)
	.put(function(req, res) {

		Exercise.findById(req.body.id)

			.then(exercise => { 

				if (req.body.timer) {
					exercise.timer.duration  = req.body.timer.duration;
				}
				else{
					exercise.timer = {};
				}

				// delete arrays' info
				exercise.lights = [];
				exercise.music = [];
				exercise.videoTutor = [];

				// Set DB elements
				setDBelements(exercise,req.body);

				exercise.save()
					.then(exercise => { 
						res.json({ message: 'Se ha modificado la estructura.' }) 
					})

					.catch(err => res.status(500).send("No se ha ingresado una estructura adecuada."))

			})

			.catch(err => res.status(404).send("No existe un elemento con el ID introducido."))

	});


// ----------------------------------------------------
router.route('/:id')

	// get the exercise with  id (accessed at GET http://localhost:8080/exercises/:id)
	.get(function(req, res) {
		Exercise.findById(req.params.id)
			.then(exercise => {
				res.json(exercise);
				
			})
			.catch(err => res.status(500).send("Formato de ID incorrecto."))
		
	})

	// delete the exercises with id (accessed at DELETE http://localhost:8080/exercises/:id)
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
