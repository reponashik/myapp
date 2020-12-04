//------------------------------------------
//requiring supporting packages
var express = require ('express')
var bodyParser = require('body-parser')
var session = require ('express-session')
var validator = require('express-validator')
var mongoose = require('mongoose');
//--------------------------------------------------

//--------------------------------------------------
//declare constant values to enable routes to function properly
const expressSanitizer = require('express-sanitizer')
const app = express()
const port = 8000 //network
const bcrypt = require('bcryptjs');//hashing
const saltRounds = 10
//------------------------------------------------------

//---------------------------------------------------
//Database connector code  
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/recipeedb";
MongoClient.connect(url,function(err, db){
 if (err) throw err;
 console.log("Database created!");
 db.close();
});
//-------------------------------------------------------------------

//Declare Moongoose
//---------------------------------------------------
var db = mongoose.connect(url); 
//-----------------------------------------------------

//Middleware code, app is instanstiated on creation of the
//express server 
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true })
)
//new code added to your express server
app.use(session({
	secret: 'somerandomstuffs',
	resave: false,
	saveUninitialized: false,
	cookie: {
	 express: 600000
    }
}));
//------------------------------------------------

//Require functional engines 
//-------------------------------------------------
require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.set('view engine', 'pug');
app.engine('html',require('ejs').renderFile);
app.listen(port, () => console.log('Example app listening on port ${port}!'))
//-------------------------------------------------------------
