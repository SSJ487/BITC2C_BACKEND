var express = require('express');
const models = require('../models')
var router = express.Router();

router.get('/',(req,res,next)=>{
    models.User.findAll().then(result=>{
        res.send({
            posts:result
        })
    })
});


router.post('/', function(req, res, next) {
    let body = req.body;
    

    models.User.create({
      name: body.name,
      email: body.email,
      password:body.password,
      phone : body.phone,
      date : body.date,
      history : body.history,
      point : body.point,
      wallet : body.wallet,
      createdAt:body.createdAt,
      updatedAt:body.updatedAt
    })
    .then( result => {
      console.log("데이터 추가 완료");
      res.send(JSON.stringify(body))
    })
    .catch( err => {
      console.log("데이터 추가 실패");
      
    })
  });
module.exports = router;