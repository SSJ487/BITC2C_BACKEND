var express = require('express');
const models = require('../models');
var router = express.Router();



router.post('/create', function (req, res, next) {
    let body = req.body;
    
    models.Wallet.create({
        UserId: body.id,
        type: body.type,
        address: body.address,
    })
        .then(result => {
            console.log("creating!!!!")
            res.send(JSON.stringify(result));
        })
        .catch(err => {
       
            var error = JSON.stringify(err);
            error = JSON.parse(error);
           

            if (error.name == "SequelizeUniqueConstraintError"){
                res.send("wallet 주소 중복 에러!!!");
            } else if (error.name == "SequelizeForeignKeyConstraintError"){
                res.send("외래키 제약 에러!!!");
            }
        })
});


module.exports = router;