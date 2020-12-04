Ashik Repon README.md file
Requirements: 
1. It is a Node.js app: Yes, myapp is a Node.js app

2. There is a home page with links to all other pages: Implemented. http://www.doc.gold.ac.uk/usr/109/ The index page is the home page

3. There is a register page: Implemented, there is a register page, http://www.doc.gold.ac.uk/usr/109/register

4. There is user authentication page: Implemented, there is a user login page http://www.doc.gold.ac.uk/usr/109/login 

5. There is an add recipe page (available only to logged in users) for each recipe store at least three items: name of the recipe, text of the recipe and the name of the user who created/added the recipe: Implemented, there is an add recipe page only available to logged in users. http://www.doc.gold.ac.uk/usr/109/addrecipe

6. There is an update recipe page (available only to logged in users). Implemented. http://www.doc.gold.ac.uk/usr/109/update

7. There is a delete recipe page (available only to logged in users). Implemented. http://www.doc.gold.ac.uk/usr/109/erase 

8. There is a list page, listing all recipes and the name of the user who added the recipe. Implemented. http://www.doc.gold.ac.uk/usr/109/list

9. The forms have some validations. Implemented. All forms have validation. There is a mix of client-side and server-side validation in my application. Server side validation: main.js lines: 128, 129. Client side validation: views/login.html lines: 101 (keyword: required), views/register.html line 122 (type="email") which corrects format. All of the forms accross this program, even in addrecipe, updaterecipe and search have a "required" HTML attribute which does not enable a form to be submitted without values in the form entry, which counts as validation and avoids storing null data. Express validator is required in main.js in line 93. 

10. There are useful feedback messages to the user. Implemented. There are messages in both POST and GET requests and in the interface for all routes. The most important messages to the users are present is http://www.doc.gold.ac.uk/usr/109/update andhttp://www.doc.gold.ac.uk/usr/109/search where I tried making the instructions as clear as possible to allow ease of navigation

11. It has a database backend that implements CRUD operations (the database can be MySQL or Mongodb). Implemented. The Database is MongoDB. In terms of CRUD, Create happens in app.post('/addrecipe') main.js line 210 to 225. Read occurs in /search-result main.js line 253 to 257. Update in/recipeUpdated main.js line 298 to 325. Delete happens in /delete/:id line 288 to 291.

12. The create & update operations take input data from a form or forms (available only to logged in users). Implemented. The form for the create operation  (addrecipe) is present in /views/addrecipe.ejs lines 50 to 64. The form for update operation is present in /views/update.ejs lines 88 to 112. 

13. The login process uses sessions. <b> Implemented. </b> The code for this is present in main.js under the section of Session Management lines85 to 89. 

14. Passwords should be stored as hashed. <b>Implemented. </b>The code for this is present in the /loggedin and /registered route in main.js where the bycrypt hashing algorithm is present. Main.js lines 128 - 158 andalso lines 181 - 186 where bycrypt.compare is used to check validity. This can be also tested by simply registering a user, the POST message will display the hashed password in question. 

15. There is a way to logout. <b>Implemented.</b> The code for this is present in main.js lines 117 to 123 under the /logout route which destroys the session. 

16. There is a basic api i.e. recipes content can be accessed as json via http method, It should be clear how to access the api (this could include comments in code). <b> Implemented with GET HTTP request only </b>. There is a link in the home page to access the JSON API connected to theDatabase. The code for this is present in main.js 64 to 75. 

17. There are links on all pages to home page providing easy navigation for users. Implemented. All pages have a link to Home Page, inclduing POST requests messages. 


Code developed independently from previous lab submissions (own work)

1. Refer to routes/recipe.js for the Mongoose DB Schema 
2. I have used $regex and $option to accomplish the search task using Mongoose. Main.js lines 253 - 259.
3. Used mongoose.model in various occasions. Main.js line 267 and 289 for example. 
4. Delete from CRUD route. Main.js lines 288 - 291. Here I have used req.params.id which is a method of extracting HTML id as objects thanks to Mongoose (MongoDB library).
5. /recipeupdated. Main.js lines 298 - 329
6. /addrecipe route main.js lines 210 - 227 using Mongoose Model 
7. For CRUD operations create, delete and read (search) I have implemented a MongoDB library called Mongoose, which I have mentioned many times in my code comments. Mongoose enabled me to easily accomplish delete, by simply extracting the object of a row from a table, click an action and delete from the DB, which was convenient. I have used regex to search thanks to Mongo.model it is also able to search partial words as mentioned in the search route. Please refer to /routes/recipe.js to see Mongoose Model used

Database Schema 

The database is a MongoDB database called 'recipeedb'.
This database has two collections: 'accounts' and 'recipebank'
As predictable the first one stores registered users, the second stores recipes.
Account has 4 fields: id, username, password and email. The id is 
produced automatically during the creation of the document, username andemail come from user input, the password stored is HASHED. Both usernameand email store objects of type String or text.

Recipebank has fields id, recipename, recipeowner, recipedetails, preptime and difficulty. Id is set automatically. Recipename, recipeowner and recipedetails store strings with respective information. Preptime strictly store a positive value more than 0. Difficulty also stores a string butit is restricted to Easy, Medium or Hard. 

There are no dbref references of any kind. 
