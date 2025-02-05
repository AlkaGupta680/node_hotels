const  mongoose = require("mongoose");
//define personSchema 
const personSchema =  new mongoose.Schema({
    name:{
        type:String ,
        required:true
    },
    age:{
        type:Number 
    },
    work:{
        type:String ,
        enum : ['chef' , 'waiter' ,'manager' ]
    },
    mobile:{
         type:String ,
         required:true
    },
    email:{
        type:String ,
        required:true ,
        unique:true 
    },
    address:{
        type:String
    },
    salary:{
        type:Number
    }

});

//create person schema 
const person = mongoose.model('person' , personSchema) ;
module.exports = person ; 