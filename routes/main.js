//Ashik Repon - main.js 

//Initiating module exports----------------------------------------
//Modules that do not require login (access controls)
//Functionality: Under this section routes are created
//A route is attributed to different HTML/EJS pages 

module.exports = function(app) {
 app.get('/',function(req, res){
   res.render('index.html')
});
//------------------------------------------------------------------

//Login GET route
 app.get('/login',function(req, res){
   res.render('login.html');
});
//-------------------------------------------------------------------

//Register GET route
app.get('/register',function(req,res) {
 res.render('register.html');
});

//-------------------------------------------------------------------

//Search GET route
app.get('/search',function(req,res){
   res.render("search.html");
});

//-------------------------------------------------------------------

//List GET route
//Summary of functionality: 
//A list route is created, this route is reading data from the DB
//Mongodb is required under this root and it is passing through the
//to.Array() method the content of the collection called 'recipebank'
//Into an EJS file called list.ejs
app.get('/list', function(req,res){
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost';
MongoClient.connect(url, function(err, client) {
if (err) throw err;

var db = client.db('recipeedb');
db.collection('recipebank').find().toArray((findErr, results) => {
if (findErr) throw findErr;//if error show message
else
 res.render('list.ejs', {availablerec:results});
client.close(); //closing DB connection
});
});
});

//-------------------------------------------------------------------

//API - Requirement no. 16 - Simple API accessed through GET HTTP method
//There is an API option that can be accessed from main menu
//of the application that can display the results
//This API retrieves the data coming from the recipe DB
//Specifically the recipes in the collection called 'recipebank'
//Data is retrieved as JSON format as expected by submission
app.get('/api', function(req,res) {
   var MongoClient = require('mongodb').MongoClient;
   var url = 'mongodb://localhost';
  //changed to users momentarily
   MongoClient.connect(url,function(err,client){
   if(err) throw err
   var db = client.db('recipeedb');
     db.collection('recipebank').find().toArray((findErr,results)  => {
     if(findErr) throw findErr;
     else
     res.json(results) //Expected format
     client.close();
});
});
});
//-----------------------------------------------------------

//Importing or requring supporting modules


//Session Management------------------------------------------
const redirectLogin = (req, res, next) => {
if(!req.session.userId){
  res.redirect('./login')
} else { next(); }
}
//-------------------------------------------------------------

//Require Express Validator---------------------------------------
const {check, validationResult } = require('express-validator');
//----------------------------------------------------------------


//Require Mongoose------------------------------------------------
//Explanation of Mongoose:
//Mongoose is an object data modelling library for MongoDB
//It eases data transit and provides a validation schema
//As this was part of the schema, it will be discussed in more detail
//in the README file 
//This code has been added independently from learning resources (own work)
var mongoose = require('mongoose');
var User = require('./../routes/recipe.js');
mongoose.model('User');
//The name of the Mongoose Model is User, you can find this in routes/recipe.js
//-----------------------------------------------------------------

//Access control routes - loggedin and registered
//All users are able to register with username, password and email
//All users are able to login with username and password
//--------------------------------------------------------------------

//Logout route which destoys current user session

app.get('/logout',redirectLogin,(req,res) => {
	req.session.destroy(err => {
	if(err) {
	return res.redirect('./')
	}
        res.send('You are now logged out. <a href='+'./'+'>Home</a>');		});
});

//--------------------------------------------------------------------

//Registered route---------------------------------------------------
app.post('/registered',[check('email').isEmail()],[check('username').isLength({min: 4}).trim()],[check('password').isLength({min: 4}).trim()],function(req,res){
//Validation code on server side for registered route is showed above
//saving data in database
//This route uses the bycrypt hashing algorithm to convert 
//plainpassword into hashed passwords. 
//Only the hashed password is saved in the collection 'accounts'
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
	res.redirect('./register'); }
    else {
        const bcrypt = require ('bcryptjs')
        const plainPassword =req.sanitize( req.body.password);
        const saltRounds = 10
        var MongoClient = require('mongodb').MongoClient;
        var url ='mongodb://localhost';
        MongoClient.connect(url, function(err,client) {
            if (err) throw err; 
            var db = client.db ('recipeedb');
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){
                db.collection('accounts').insertOne({
                    username: req.sanitize(req.body.username),
                    password: hashedPassword,
                    email: req.sanitize(req.body.email)
                });
                res.send('You are now registered your user name is : ' + req.body.username + ' your password is ' + req.body.password + ' and your hashed password is: ' + hashedPassword + '<br/>'+' <a href='+'./'+'>Home</a>');
//Appropriate message is displayed
                client.close();
            });
        });
    }
});
//----------------------------------------------------------------------

//Logged In route-------------------------------------------------------
//Main functionality: Comparision of password occurs
//with the hashed version saved from the database
//if success, then user is logged in, otherwise login incorrect
//This route has been designed to let the user know if the issue is the username or the passoword
app.post('/loggedin', function(req, res){
const bcrypt = require ('bcrypt');
const plainPassword = req.body.password;
var MongoClient = require ('mongodb').MongoClient;
var url = 'mongodb://localhost';
MongoClient.connect(url, function(err,client){
if(err) throw err;
var db = client.db('recipeedb');
//Loading comparison data
db.collection('accounts').findOne( {username: req.body.username}, function(err, user){
if(err) throw err;
if(user == null){
res.send('Login not successful, wrong username' + '<a href='+'./'+'>Home</a>');
}
//calling bycrypt.compare to check password validity
bcrypt.compare(plainPassword, user.password, function(err, result)  {
if(result == true) {
req.session.userId = req.body.username;
res.send('Login successful, welcome ' + req.body.username + '<br />' + '<a href='+'./'+'>Home</a>');
}else{
res.send('Login not successful, wrong password'+'<br />' + '<a href='+'./'+'>Home</a>');
}
});
client.close();
});
});
});
//-------------------------------------------------------------

//Add, delete, search and update recipe routes (CRUD)
//Add, delete and search have been implemented through 
//a Mongoose approach, update has been implemented using 
//classic approach: client connection with DB.

//-------------------------------------------------------------------------

//Add recipe GET route, calling an EJS page
app.get('/addrecipe',redirectLogin,function(req,res){
   res.render('addrecipe.ejs');
});

//Post request is passing form details to an object 
//that matches the Mongoose model, which then is stored in the database
//in the collection called recipebank
app.post('/addrecipe',function(req,res){
   var obj = {
   recipename: req.body.recipename,
   recipeowner: req.body.recipeowner,
   recipedetails: req.body.recipedetails,
   preptime: req.body.preptime,
   difficulty: req.body.difficulty,
   publisher: req.session.userID
   
   }
   //mongoose.model(NAME) is the equivalent of db.connection(COLLECTIONNAME)
   mongoose.model("User").create(obj,function(err,recipe){
   if(err){
   res.send("Some error");
}
   res.send("New recipee created"+'<br />' + '<a href='+'./'+'>Home</a>');
});
});

//------------------------------------------------------------------------------
//This is the view GET route, this will load a EJS file with the data
//from the mongoose model, which is the same as the 'recipebank' collection in the DB
//View.ejs is the page that serves the purpose of showing the data and provide the action 
//of deleting them as part of CRUD
app.get('/erase',redirectLogin,function(req,res){
mongoose.model("User").find(function(err,recipe){
if(err){
res.send("Some error occured");
}
res.render('view.ejs',{
     recipe : recipe
     //recipe:recipe is sending the value to EJS 
});
});
});

//------------------------------------------------------------------------------

//The search-result route is also implemented thanks to the Mongoose model
//The search is accomplished thanks to the key command $regrex which
//recursivvely searches for similarity or similar pattern to associate
//After which, the value is passed through the callback function back to the 
//research.ejs file where all the searches appear
app.get('/search-result',function(req,res){
mongoose.model("User").find({recipename: { $regex: req.query.keyword.trim(), $options: "i"} },
function(err,search){
if(err) throw err;
res.render('research.ejs',{availablerec:search});
});
});


//-----------------------------------------------------------
//Update is another GET route needed to load data from the Mongoose model 
//This time to serve the purpose of enabling the updating functionality 

app.get('/update',redirectLogin,function(req,res){
mongoose.model("User").find(function(err,recipe){
if(err){
res.send("Some error occured");
}
res.render('update.ejs',{
     recipe : recipe
});
})
});

//------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------

//Deleting 
//Functionality: To avoid typing the full name of a recipe to be deleted
//I am retrieving the ID of the row containing the record to be deleted in the JES file
//Delete one is a mongodb command which deletes the row of data, from the table, as well as the 
//database by passing the value as a parameter into deleteOne
//After the process is over, the program redirects to view to show the user that data has been deleted
//This can also be double checked by consulting the list route, or even through the mongo shell
app.get('/delete/:id',redirectLogin,function(req,res){
 mongoose.model("User").deleteOne({_id:req.params.id},function(err,delData){})
res.redirect('/usr/109/erase');
});

//---------------------------------------------------------------------------------------------------
//This is the update recipe route
//This route requires the DB just like in loggedin 
//The update happens through the command updateMany and the $set 
//which sets new form data and replaces them with previously added data present in the database
app.post('/recipeUpdated', function(req,res){
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost';
MongoClient.connect(url, function(err, client) {
if (err) throw err;
//data from update form
var db = client.db('recipeedb');
var currentName = req.body.updatename;
var newOwner = req.body.updateowner; 
var newDetails = req.body.updatedetails;
var newTime = req.body.updatetime;
var newDiff = req.body.updatedifficulty;
var newName = req.body.newname;
//update data
db.collection('recipebank').updateOne(
{'recipename' : currentName},
{$set:
{
'recipeowner' : newOwner, 
'recipedetails' : newDetails,
'recipename' : newName,
'preptime' : newTime,
'difficulty' : newDiff
}
},function(err,result){
if(err) throw err;
client.close();
res.redirect('/usr/109/update');
}
);
});
});
//End------------------------------------------------------------
}

