const  mongoose = require("mongoose");
const bcrypt = require('bcrypt') ;
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
    },
    username:{
        required:true ,
        type:String 
    },
    password:{
      required:true ,
      type:String
    }

});

personSchema.pre('save' , async function(next){
    const person = this ;
    //hash the password only if it has been modified(or is new)
    if(!person.isModified('password')) return next() ;
    try {
       //hash password  generation 
       const salt = await bcrypt.genSalt(10) ;
       //hash passwrod
       const hashedPassword = await bcrypt.hash(person.password , salt) ;
       
       //override the plain  password with hashed  one  
       person.password = hashedPassword ;
       next() ;
    } catch (error) {
        return next(error) ; 
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch = await  bcrypt.compare(candidatePassword, this.password) ;
        return isMatch ;
    } catch (error) {
        throw error ;
    }
}
//create person schema 
const person = mongoose.model('person' , personSchema) ;
module.exports = person ; 