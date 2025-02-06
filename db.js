const mongoose = require('mongoose') ;
// const mongoURL = 'mongodb://localhost:27017/hotel' ;
const mongoURL = 'mongodb+srv://programer3753:Alka%40123@cluster0.dxkqm.mongodb.net/';
//set up mongoDB connection 
mongoose.connect(mongoURL ,{
      useNewUrlParser:true,
      useUnifiedTopology:true       
}
) ;
// mongdb object 
const db=mongoose.connection ;
//define event listeners 
db.on('connected',()=>{
    console.log("MongoDB connected to server") ;
}) 
db.on('error',(err)=>{
    console.log("MongoDB error:",err) ;
}) 
db.on('disconnected',()=>{
    console.log("MongoDB disconnected") ;
}) 

 
  
//export 
module.exports = db ;
