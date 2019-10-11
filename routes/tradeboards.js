var express = require('express');
const models = require('../models');
var router = express.Router();



router.post('/create', function (req, res, next) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    let body = req.body;
   
    
    models.TBoard.create({
        type: body.type,
        amount: body.amount,
        price: body.price,
        method: body.method,
        status: body.status,
        sellerId: body.sellerId,
        buyerId: body.buyerId,
        createdAt: today,
        updatedAt: today
    })
        .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            console.log("데이터 추가 실패");

        })
});









router.get("/index/:page", function (req, res) {

    let pageNum = req.params.page;
    console.log(pageNum);
    let offset =0;

    if(pageNum>1){
        offset=7*(pageNum-1);
    }

    models.TBoard.findAll({
        offset:offset,
        limit:7
    }).then(result=>{
        res.json({
            result
        });
    }).catch(err =>{
        console.log("fail")
    })

  
    

})


module.exports = router;
