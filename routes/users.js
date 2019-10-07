var express = require('express');
const models = require('../models');
var bcrypt = require('bcrypt');
var router = express.Router();




//crypto confirm
router.post('/login',(req,res,next)=>{
  console.log("asdqwd")
  console.log(req.body.email)
  models.User.findOne({
    where : {
      email:req.body.email
    }
  }).then( (user)=>{
    console.log(user);
    if(!user){
      res.redirect('/');
    }else{
      bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result == true){
          res.send('Login')
        }else{
          res.send('Incorrect password');
        }
      })
    }
  })  


})

router.post('/create', function(req, res, next) {
    var today = new Date();
    var dd =String(today.getDate()).padStart(2,'0');
    var mm =String(today.getMonth()+1).padStart(2,'0');
    var yyyy = today.getFullYear();

    today = mm+'/'+dd+'/'+yyyy;
   
    let body = req.body;
    bcrypt.genSalt(10,(err,salt)=>{
      if(err){
        console.log('bcrypt.genSalt() errer:',err.message)
      }else{
        bcrypt.hash(body.password,salt,(err,hash)=>{
          models.User.create({
            name: body.name,
            email: body.email,
            password:hash,
            phone : body.phone,
            point : body.point,
            wallet : body.wallet,
            createdAt:today,
            updatedAt:today,
            emailcheck:body.emailcheck
          })
          .then( result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(body))
          })
          .catch( err => {
            console.log("데이터 추가 실패");
            
          })
    
        })
      }


    })
 
  
    
  });

  
  
module.exports = router;