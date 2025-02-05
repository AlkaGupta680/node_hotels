const express=require('express') ;
const router = express.Router();
const person = require('./../models/person');

// below are end points and API are PUT,GET,POST,DELETE(CRUD)
// POST METHOD route to add person
router.post('/' , async(req,res)=>{
    try {
     const data = req.body ;
       //create a new person document using mongoose model 
     const newPerson = new person(data) ;
     //save new person to database 
     const response = await newPerson.save() ;
     console.log("data saved") ;
     res.status(200).json(response) ;
    } 
    catch (err) {
      console.log(err) ;
      res.status(500).json({error:'internal server error'}) ;
    }
 })


 //GET METHOD
  router.get('/' , async(req,res)=>{
   try {
      const data = await person.find() ;
      console.log("data fetched sucessfuly") ;
     res.status(200).json(data) ;
   } catch (err) {
     console.log(err) ;
      res.status(500).json({error:'internal server error'}) ;
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

//export 
  module.exports = router ;