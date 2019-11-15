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
    var today = new Date()
    const boardId = req.body.id;
    const userId = req.body.userid
    //console.log(boardId);
    console.log('exchange',userId)

    models.TBoard.update({
        status: 1,
        buyerId: userId,
        updatedAt: today
    },{
        where: {
            id: boardId
        }
    }).then((data) => {
        console.log('exchange = ',data)
        res.json(data)
    })

})


router.post('/create', function (req, res, next) {

    var today = new Date()

    let body = req.body;
    console.log('body=',body);
    
    models.TBoard.create({
        selltoken: body.selltoken,
        buytoken: body.buytoken,
        selltokenamount: body.selltokenamount,
        buytokenamount: body.buytokenamount,
        status: body.status,
        contractwallet:'asdasfasf',
        sellerId: body.sellerId,
        buyerId: body.buyerId,
        createdAt: today,
        updatedAt: today,
        Expirydate:today
    })
        .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            console.log("데이터 추가 실패");
            console.log(err)
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
