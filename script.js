const express = require('express')
const app = express()
const db = require('./db');
const passport = require('./Auth');
require('dotenv').config();

//body parser
const bodyParser = require('body-parser') ;
app.use(bodyParser.json()) ; // req.body 
const PORT = process.env.PORT||3000  // THIS IS IMPORT FROM .ENV



app.use(passport.initialize()) ;

const localAuthMiddleware =passport.authenticate('local',{session:false}) ;

//GET METHOD of home
app.get('/', function (req, res) {
  res.send('welcome to my hotel')
})


//MiddleWare function 
const logRequest = (req,res,next)=>{
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl},Visitor IP: ${ip}`) ;
  next() ;
}


//it is connect to all apis 
app.use(logRequest)

 

//IMPORT person router file 
const personRoutes = require('./routes/personRoutes');
//use routers
app.use('/person',localAuthMiddleware,personRoutes) ;

//IMPORT menuitem router file 
const MenuItemRoutes = require('./routes/menuitemRoutes');
//use routers
app.use('/MenuItem' ,MenuItemRoutes) ;



 

app.listen(PORT , ()=>{
    console.log("server is listening on port 3000")
})