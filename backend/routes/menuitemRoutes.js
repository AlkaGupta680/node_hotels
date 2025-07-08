const express=require('express') ;
const router = express.Router();
const MenuItem = require('./../models/menu');


// below are end points and API are PUT,GET,POST,DELETE(CRUD)
//POST METHOD for menu database 
router.post('/', async(req,res)=>{
    try {
      const data = req.body ;
      // create new list 
       const menulist = new MenuItem(data)
       // save 
       const response = await menulist.save() ;
       console.log("data saved") ;
       res.status(200).json(response) ;
  
    } catch (err) {
      console.log(err) ;
       res.status(500).json({error:'internal server error'}) ;
    }
  });

  // GET METHOD for menu database

router.get('/' , async(req,res)=>{
    try {
       const data = await MenuItem.find() ;
       console.log("data fetched sucessfuly") ;
      res.status(200).json(data) ;
    } catch (err) {
      console.log(err) ;
       res.status(500).json({error:'internal server error'}) ;
    }
   }) ;

   //module.export
   module.exports = router ; 