var express = require('express');
const models = require('../models');
var router = express.Router();

router.post('/', function(req, res, next) {
    var today = new Date();
    var dd =String(today.getDate()).padStart(2,'0');
    var mm =String(today.getMonth()+1).padStart(2,'0');
    var yyyy = today.getFullYear();

    today = mm+'/'+dd+'/'+yyyy;
   
    let body = req.body;
    console.log(body.name);
    console.log(body.email);
    console.log(body.password);
    console.log(body.phone);
    console.log(body.point);
    console.log(body.wallet);
    console.log(today);
    models.User.create({
      name: body.name,
      email: body.email,
      password:body.password,
      phone : body.phone,
      point : body.point,
      wallet : body.wallet,
      createdAt:today,
      updatedAt:today
    })
    .then( result => {
      console.log("데이터 추가 완료");
      res.send(JSON.stringify(body))
    })
    .catch( err => {
      console.log("데이터 추가 실패");
      
    })
    
  });

  models.sequelize.sync({force:true}).then(()=>{
      console.log("DB connect")
  }).catch(err=>{
      console.log(err);
  }) 
  
module.exports = router;