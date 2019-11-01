const express = require('express');
const models = require('../models');
const router = express.Router();
let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");


router.get("/orderling",(req,res)=>{
    const method = req.param('method')
    let order = "DESC";
    if(!req.param('order')){
        order="ASC";
    }

    models.TBoard.findAll({
        order:[[method,order]]
    }).then(result =>{
        res.json(result);
    }).catch(err=>{
        console.log(err);
    })
})



//디테일 화면 진행상태 변경 POST
router.post('/exchange',function(req,res){
    const token = req.headers.authorization.split(' ')[1]
    const boardId = req.body.id;
   
    //console.log(boardId);
    let decoded = jwt.verify(token, secretObj.secret);
    // console.log(decoded);
    if (decoded) {
        //board ID값을 이용하여 front에서 type에 따라 렌더화면 변경
        models.TBoard.findOne({
            where: {
                id: boardId
            }
        }).then((user) => {
            res.send(user.method)
        })
    } else {
        res.send("no")
    }

    models.TBoard.update({
        status: 1,
    },{
        where: {
            id: boardId
        }
    }).then((user) => {
    })

})


router.post('/create', function (req, res, next) {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    let body = req.body;
   
    
    models.TBoard.create({
        selltoken: body.selltoken,
        buytoken: body.buytoken,
        selltokenamount: body.selltokenamount,
        buytokenamount: body.buytokenamount,
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
})

router.get('/detail', (req, res) => {
    
    models.TBoard.findOne({
        where: {
            id: req.query.id
        }
    }).then((result) => {
        res.json(result);
    }).catch((e) =>{
        console.log(e)
    })
})

router.get("/index/:page", function (req, res) {
    const sellcoin = req.param('sellcoin')
    const buycoin = req.param('buycoin')

    let method = req.param('method')
    let level = req.param('order');
    
    let order = "DESC";
    

    if(level==="false"){
        
        order="ASC";
    }
   
    let pageNum = req.params.page;
    console.log(pageNum);
    let offset =0;

    if(pageNum>1){
        offset=10*(pageNum-1);
    }
    if(method===undefined){
        models.TBoard.findAll({
            offset:offset,
            limit:10,
            where:{
                selltoken:sellcoin,
                buytoken:buycoin
            },
        }).then(result=>{
            res.json(
                result
            );
        }).catch(err =>{
            console.log("fail")
        })
    }else{
        models.TBoard.findAll({
            offset:offset,
            limit:10,
            where:{
                selltoken:sellcoin,
                buytoken:buycoin
            },
            order:[[method,order]]
        }).then(result=>{
            res.json(
                result
            );
        }).catch(err =>{
            console.log("fail")
        })
    }
    
       
    
    

})

router.get("/sell/:page", function (req, res) {
    const method = req.param('method')
    const cointype =req.param('type');
    let order = "DESC";

    let level = req.param('order');

    if(level==="false"){
        
        order="ASC";
    }

    let pageNum = req.params.page;
    console.log(pageNum);
    let offset =0;

    if(pageNum>1){
        offset=10*(pageNum-1);
    }

    if(method){
        models.TBoard.findAll({
            offset:offset,
            limit:10,
            where:{
                method : "sell",
                type:cointype
            },
            order:[[method,order]]
        }).then(result =>{
            res.json(result);
        }).catch(err=>{
            console.log(err);
        })
    }else{
        models.TBoard.findAll({
            where: {
                method : "sell",
                type:cointype
            },
            offset:offset,
            limit:10
        }).then(result=>{
            res.json(
                result
            );
        }).catch(err =>{
            console.log("fail")
        })
    }
    

})

router.get("/buy/:page", function (req, res) {

    const method = req.param('method');
    const cointype =req.param('type');
    let level = req.param('order');

    let order = "DESC";

    
    if(level==="false"){
        
        order="ASC";
    }

    let pageNum = req.params.page;
    console.log(pageNum);
    let offset =0;

    if(pageNum>1){
        offset=10*(pageNum-1);
    }

    if(method){
        models.TBoard.findAll({
            offset:offset,
            limit:10,
            where:{
                method : "buy",
                type:cointype
            },
            order:[[method,order]]
        }).then(result =>{
            res.json(result);
        }).catch(err=>{
            console.log(err);
        })
    }else{
        models.TBoard.findAll({
            where: {
                method : "buy",
                type:cointype
            },
            offset:offset,
            limit:10
        }).then(result=>{
            res.json(
                result
            );
        }).catch(err =>{
            console.log("fail")
        })
    }

   

})


// 거래 게시글 삭제
router.post('/delete', function (req, res, next) {
    models.TBoard.destroy({
        where: {
            
        }
    })
        .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            console.log("데이터 추가 실패");

        })
});

module.exports = router;
