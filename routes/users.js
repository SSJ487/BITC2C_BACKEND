var express = require('express');
const models = require('../models');
var bcrypt = require('bcrypt');
var router = express.Router();
let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
var request = require('request');
const nodemailer = require('nodemailer');
const emailcreate =require('./register')
//To store token in cookies
router.get("/someAPI", (req, res, next) => {
  let token = req.cookies.logincookie;
  console.log(token);
  let decoded = jwt.verify(token, secretObj.secret);
  if (decoded) {
    res.send("token confirm")
  } else {
    res.send("no")
  }
})


//crypto confirm
router.post('/login', (req, res, next) => {
  console.log("asdqwd")
  console.log(req.body.email)
  models.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    console.log(user);
    if (!user) {
      res.redirect('/');
    } else {
      console.log("else dlsl")
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result == true) {
          let token = jwt.sign({
            email: req.body.email
          },
            secretObj.secret,
            {
              expiresIn: '5m'
            })

          res.cookie("logincookie", token);
          res.json({
            token: token
          })
        } else {
          res.send('Incorrect password');
        }
      })
    }
  })


})


router.post('/create', function (req, res, next) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();


  today = mm + '/' + dd + '/' + yyyy;

  let body = req.body;
  let email = body.email;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log('bcrypt.genSalt() errer:', err.message)
    } else {
      bcrypt.hash(body.password, salt, (err, hash) => {
        models.User.create({
          name: body.name,
          email: body.email,
          password: hash,
          phone: body.phone,
          point: 0,
          wallet: body.wallet,
          createdAt: today,
          updatedAt: today,
          emailcheck: 0
        })
          .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(body));
            emailcreate(nodemailer,email);
          })
          .catch(err => {
            console.log("데이터 추가 실패");
            console.log(err);
            var error = JSON.stringify(err);
            error = JSON.parse(error);
            console.log(error);
            console.log(error.name);

            if (error.name == "SequelizeUniqueConstraintError") {
              res.send("email 중복 오류입니다.");

              // 회원가입 페이지로 이동
              // request.post({
              //   url: 'http://localhost:5555/register/',
              //   body: {
              //     email: email
              //   },
              //   json: true
              // }, function (err, response, body) {
              //   console.log(err);
              //   res.json(body);
              // });
            }
          })

      });
    }
  });



  // res.redirect('/');
})


module.exports = router;