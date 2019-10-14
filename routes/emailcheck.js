
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

})


module.exports = router;
