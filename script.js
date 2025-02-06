const express = require('express')
const app = express()
const db = require('./db');
require('dotenv').config();
//body parser
const bodyParser = require('body-parser') ;
app.use(bodyParser.json()) ; // req.body 

const PORT = process.env.PORT||3000  // THIS IS IMPORT FROM .ENV

//GET METHOD of home
app.get('/', function (req, res) {
  res.send('welcome to my hotel')
})


//IMPORT person router file 
const personRoutes = require('./routes/personRoutes');
//use routers
app.use('/person' , personRoutes) ;

//IMPORT menuitem router file 
const MenuItemRoutes = require('./routes/menuitemRoutes');
//use routers
app.use('/MenuItem' ,MenuItemRoutes) ;



 

app.listen(PORT , ()=>{
    console.log("server is listening on port 3000")
})