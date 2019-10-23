var express = require('express');
const models = require('../models');
var bcrypt = require('bcrypt');
var router = express.Router();
let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
const nodemailer = require('nodemailer');


//토큰을 이용하여 유저정보 가져오기
router.get('/getuser',function(req,res){
  const token = req.param('token')
  
  //const boardId= req.param('boardId');
  console.log('getuser router1')
  console.log(token);
  
  //console.log(boardId);
  let decoded = jwt.verify(token, secretObj.secret);
  console.log(decoded);
  if (decoded) {
     
     res.send(decoded)

      
  } else {
      res.send("error")
  }
})

//이메일 확인 요청 링크 클릭시 오는 라우터
router.get('/emailcheck', function (req, res) {
  let email = req.query.email;
  console.log(email);

  models.User.update({
    emailcheck: "1",
  },{
    where: {email: email}
  }).then(result => {
    console.log(result, "  권한 추가 완료");
    res.redirect("http://localhost:3000/user/login")
  }).catch(err => {
    console.log(err, "   에러!!!");
  });
})

//crypto confirm
router.post('/login', (req, res, next) => {
  console.log(req.body.email)
  models.User.findOne({
    where: {
      email: req.body.email,
      emailcheck: '1'
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
            id : user.id,
            email: req.body.email
          },
          secretObj.secret,
          {
            expiresIn:'60m'
          })

          res.cookie("logincookie", token);
          res.json({
            token: token
          })
        } else {
          res.redirect(404, 'Incorrect password');
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
          createdAt: today,
          updatedAt: today,
          emailcheck: 0
        })
          .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(body));
            emailcreate(email);
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

function emailcreate(nodeemail) {
  let email = nodeemail;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'a01026879718@gmail.com',  // gmail 계정 아이디를 입력
      pass: 'a01026879718'          // gmail 계정의 비밀번호를 입력
    }
  });

  let mailOptions = {
    from: 'a01026879718@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: email,                     // 수신 메일 주소
    subject: '안녕하세요, OOOO입니다. 이메일 인증을 해주세요.',
    html: '<p>아래의 링크를 클릭해주세요 !</p>' +
      "<a href='http://localhost:5555/users/emailcheck/?email=" + email + "'>인증하기</a>"
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
      res.send(info.response);
    }
  });

}

module.exports = router;