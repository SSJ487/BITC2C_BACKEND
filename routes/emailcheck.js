
const express = require('express');
const models = require('../models');
const router = express.Router();

router.get('/', function (req, res, next) {
    let email = req.query.email;
    console.log(email);


    models.User.update({
        emailcheck: "1",
    }, {
        where: { email: email }
    }).then(result => {
        console.log(result, "권한 추가 완료");
        res.redirect('http://localhost:3000/user/login');
    }).catch(err => {
        console.log("에러!!!!!!!!!!!!!!!!!!");
        console.log(err);
    });


    // var sql = "UPDATE users SET auth = '1' WHERE email = ?";

    // dbconn.query(sql, email, function(err, results){
    //     if(err){
    //         console.log(err);
    //         res.render('incorrect_email');
    //         return;
    //     }else{
    //         console.log(results);
    //     }
    // });

    // token이 일치하면 테이블에서 email을 찾아 회원가입 승인 로직 구현
})


module.exports = router;
