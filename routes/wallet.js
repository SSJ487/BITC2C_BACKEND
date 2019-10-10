var express = require('express');
const models = require('../models');
var router = express.Router();



router.post('/create', function (req, res, next) {
    let body = req.body;


    models.Wallet.create({
        UserId: body.id,
        type: body.type,
        address: body.address,
        amount: body.amount
    })
        .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            console.log(err);
            console.log("데이터 추가 실패");

        })
});


module.exports = router;