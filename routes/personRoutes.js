const express=require('express') ;
const router = express.Router();
const person = require('./../models/person');
const {jwtMiddleware,generateToken}= require('./../jwt')

// below are end points and API are PUT,GET,POST,DELETE(CRUD)

// POST METHOD route to add person
router.post('/signup' , async(req,res)=>{
    try {
     const data = req.body ;
       //create a new person document using mongoose model 
     const newPerson = new person(data) ;
     //save new person to database 
     const response = await newPerson.save() ;
     console.log("data saved") ; 
       //payload 
       const payload = {
        id:response.id ,
        username: response.username
       }
       console.log(JSON.stringify(payload)) ;
       const token = generateToken(payload) ;
       console.log('Token saved is : ' , token)
     res.status(200).json({response:response , token : token}) ;
    } 
    catch (err) {
      console.log(err) ;
      res.status(500).json({error:'internal server error'}) ;
    }
 })


 //GET METHOD to get person **something error here it is not runnig when given token to this
  router.get('/' ,jwtMiddleware, async(req,res)=>{
   try {
      const data = await person.find() ;
      console.log("data fetched sucessfuly") ;
     res.status(200).json(data) ;
   } catch (err) {
     console.log(err) ;
      res.status(500).json({error:'internal server error'}) ;
   }
  })

//login route  error here 
router.post('/login' ,async(req,res)=>{
  try {
    //extract username and password 
    const{username,password} = req.body ;
    //find user 
    const user = await person.findOne({username:username}) ;
    //if user do not exit or password is incorrect 
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:'Invalid username or password'})
    }
    //generate token 
    const payload ={
      id:user.id ,
      username:user.username 
    }
    const token = generateToken(payload)
    //return token as response 
    res.json({token})
  } catch (err) {
    console.log(err) ;
    res.status(500).json({error:'internal serval error'})
  }
}) ; 

//profile route 
router.get('/profile',jwtMiddleware , async(req,res)=>{
   try {
     const userData = req.user ;
     console.log("user data :" , userData) 
     const userId = userData.id ;
     const  user =  await person.findById(userId) ;

     res.status(200).json({user}) ;

   } catch (err) {
    console.log(err) ;
    res.status(500).json({error:'internal serval error'})
   }
})

  // parameterised API FOR PERSON DATABASE
router.get('/:workType' , async(req,res)=>{
    try {
       const workType = req.params.workType ;
       if(workType=='chef'||workType=='waiter'||workType=='manager'){
      const response = await person.find({work:workType}) ;
      console.log(" response fetched")
      res.status(200).json(response) ;
       }
      else{
        res.status(404).json({error:'invalid workType'}) ;
      }
  
    } catch (err) {
      console.log(err) ;
      res.status(500).json({error:"internal server error"})
      
    }
  });

//update 
router.put('/:id',async(req,res)=>{
  try {
    const personId = req.params.id ;//extract the id from  URL paramter 
    const updatepersonData = req.body ;// update data for the person 
    const response = await person.findByIdAndUpdate(personId , updatepersonData,{
      new:true ,// return data updated document
      runValidators:true // run mongoose validation(condition)
    })
    if(!response){
      return res.status(404).json({error:'person not found'}) ;
    }
    console.log(" data updated")
      res.status(200).json(response) ;

  } catch (err) {
    console.log(err) ;
      res.status(500).json({error:"internal server error"})
  }
})

// delete
router.delete('/:id' ,async(req,res)=>{
  try {
    const personId = req.params.id ; // extract person id 
    const response = await person.findByIdAndDelete(personId) // delete personid
    if(!response){
      return res.status(404).json({error:'person not found'}) ;
    }
    console.log(" data deleted")
      res.status(200).json({message:'person deleted sucessfuly'}) ;
  } catch (err) {
    console.log(err) ;
      res.status(500).json({error:"internal server error"})
  }
})

//module export  this is very imp step 
  module.exports = router ;