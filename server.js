const notes=require('./notes.js') ;
var fs=require('fs') ;
var os=require('os') ;
var _ = require('lodash') ;
var user = os.userInfo() ;
console.log(user) ;
 fs.appendFile('greeting.txt','hello this is txt file\n',()=>{
    console.log("file is created") ;
 })
 var age = notes.age ;
console.log(age) ;


// we can find unique 
var data=[2,3,'alka','alka',2,4,'alka'] ;
let filter= _.uniq(data) ;
console.log(filter) ;
console.log(_) ;



















// function add(a,b){
//     return a+b ;
// }
// var result = add(4,5) ;

// var multiply =function(a,b){
//     return a*b ; 
// }
// //arrow function
let divison=(a,b)=> {
    if(a>b){
        return a/b;
    }
  else{
    console.log("can't divide") ;
  }
}
// console.log(result+"\n"+ multiply(3,4)+"\n"+divison(4,2));

// //conside a line function 
// let sub =(a,b)=>a-b ;
// console.log(sub(3,2)) ;
function callback(){
    console.log("hello is calling callback")
}

var hello = function(a,b,callback){
    console.log("hello mitra") ;
    callback(a,b) ;
}
hello(2,3,()=>console.log("this is callback inline function")) ;