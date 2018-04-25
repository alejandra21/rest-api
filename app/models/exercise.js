var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ExerciseSchema   = new Schema({
	name: String,
	typeExercise    : String,
    mainImage       : String,
    levelDifficulty : Number,
    timer           : {
    						duration   : Number 
    				  },
    lights          : [{ 
    						colorCode  : String 
    				  }],
    music           : [{ 
    						name       : String,
    						sourcePath : String,
    						volumen    : Number
    				  }],
   	videoTutor      :[{
   						name        : String,
   						sourcePath  : String
   					 }],
   	createdBy       : String,
   	creationDate    : Date,
   	status          : String
});

ExerciseSchema.plugin(autoIncrement.plugin, 'ExerciseSchema');
module.exports = mongoose.model('ExerciseSchema', ExerciseSchema);