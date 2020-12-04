//require mongoose package
var mongoose = require('mongoose');
//declare schema
//declare field names and field attributes
var userSchema = new mongoose.Schema({
        recipename: String,
        recipeowner: String,
        recipedetails: String,
	preptime: {type: Number},
	difficulty: String
},{ collection: 'recipebank' });
mongoose.model('User',userSchema); //equivalent to db.collectionName
//Data is pushed into collection called 'recipebank'
