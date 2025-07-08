@@ .. @@
 const express = require('express')
 const app = express()
 const db = require('./db');
 const passport = require('./Auth');
const cors = require('cors');
-const cors = require('cors');
 require('dotenv').config();
 
 //body parser
 const bodyParser = require('body-parser') ;
 app.use(bodyParser.json()) ; // req.body 
 
// Enable CORS for frontend connection
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server default port
  credentials: true
}));

-// Enable CORS for frontend connection
-app.use(cors({
-  origin: 'http://localhost:5173', // Vite dev server default port
-  credentials: true
-}));
-
 const PORT = process.env.PORT||3000  // THIS IS IMPORT FROM .ENV