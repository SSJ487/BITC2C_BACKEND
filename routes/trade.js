const express = require('express');
const models = require('../models');
const router = express.Router();
let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
const web3 = require('../module/web3');
const ex = require('../module/exchange');


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

    const boardId = req.body.boardId;
    const userId = req.body.userId
    //console.log(boardId);

    var query = 'INSERT INTO orderbooks (TableId,status,sellerconfirm,buyerconfirm,selltoken,buytoken,selltokenamount,buytokenamount,createdAt,updatedAt) '
    +'select A.id,0,0,0,A.selltoken,A.buytoken,A.selltokenamount,A.buytokenamount,DATE_ADD(now(),INTERVAL 30 MINUTE),now() FROM TBoards as A where A.id =:Boardid;';
    var values = {
        Boardid: boardId
    }
    setTimeout(function () {
        models.orderbook.findOne({
            where :{
                TableId:boardId,
                status :{
                    [models.Sequelize.Op.lt] :3
                }
            }
        }).then(result=>{
            if(result===null||result===undefined) return;

            if(result.status===2){
                models.Alarm.update({
                    stautus: '2'
                }, {
                    where: {
                        tableId: boardId,
                    }
                }).then(result => {
                    console.log("상태 변경완료");
                    return;
                })
                return
            }else{
                models.TBoard.update({
                    status:0,
                    buyerId:0
                },{
                    where:{
                        id:boardId
                    }
                }).then(()=>{
                    models.orderbook.update({
                        status:4
                    },{
                        where:{
                            TableId:boardId
                        }
                    })
                }).then(()=>{
                    models.Alarm.destroy({
                        where: {
                            tableId: boardId,
                        }
                    }).then(result => {
                        console.log("삭제 완료");
                        console.log("취소되었다요")
                    })

                })
            }
        })


    },18000000)


    models.TBoard.update({
        status: 1,
        buyerId: userId,

    },{
        where: {
            id: boardId
        }
    }).then(() => {
        models.sequelize.query(query, { replacements: values }).spread((results) => {
            res.json(results)
        }, (err) => {
            res.status(404).send(err);
        })

    })

})

router.get('/gettime',(req,res)=>{
    const token = req.headers.authorization.split(' ')[1];

    let decoded = jwt.verify(token, secretObj.secret)



    const query = 'select createdAt,sellerconfirm,buyerconfirm,TableId from orderbooks as B where TableId IN (SELECT A.id from TBoards as A where (A.SellerId = :Id or A.buyerId = :Id) and (A.status=1 and B.status!=4 and B.status!=5) );'
    var values = {
        Id: decoded.id
    }
    models.sequelize.query(query, { raw:true,replacements: values ,type:models.sequelize.QueryTypes.SELECT}).spread((results) => {


        let d1 = new Date()
        ;
        console.log('gettime ==',d1);
        if(results!==undefined) {
            let time = ((Date.parse(results.createdAt)) / 1000) - (Date.parse(d1)) / 1000
            let bal = [time, results.sellerconfirm, results.buyerconfirm, decoded.id, results.TableId];
            res.json(bal);
        }
    }, (err) => {
        res.status(404).send(err);
    })

})

router.post('/confirm',(req,res)=>{
    const password = req.body.password;
    const token = req.headers.authorization.split(' ')[1];
    const tableid = req.body.TableID


    let decoded = jwt.verify(token, secretObj.secret)
    //const boardId= req.param('boardId');
    //console.log(boardId);
    models.Wallet.findOne({
        where: {
            UserId: decoded.id
        }
    }).then((result)=>{
        web3.signTest(result.address,password).then((result)=>{
            if(result){
                models.TBoard.findOne({
                    where : {
                        id:tableid,

                    }
                }).then((result)=>{
                    if(parseInt(result.sellerId)===decoded.id){
                        models.orderbook.update({
                            sellerconfirm : decoded.id,
                            status : models.sequelize.literal('status+1')
                        },{

                            where :{
                                TableId:tableid,
                                [models.Sequelize.Op.or]:[{status:0},{status:1}]
                            }
                        }).then(()=>{
                            //status가 2인지 확인하기 위한함수
                            ex.exchange(models,tableid,web3).then((success)=>{
                                console.log('success12 ========',success)
                                if(success===2){

                                    res.json({boolconfirm:true,balanceconfirm:true,transfer:true})
                                }else if(success===1){
                                    res.json({boolconfirm:false,balanceconfirm:false,transfer:false})

                                }else{
                                    res.json({boolconfirm:true,balanceconfirm:false,transfer:false})
                                }
                            })
                        })

                    }else {
                        models.orderbook.update({
                            buyerconfirm : decoded.id,
                            status : models.sequelize.literal('status+1')
                        },{
                            where :{
                                TableId:tableid,
                                [models.Sequelize.Op.or]:[{status:0},{status:1}]

                            }
                        }).then(()=>{
                            //status가 2인지 확인하기 위한함수
                            ex.exchange(models,tableid,web3).then((success)=>{
                                console.log('success12 ========',success)
                                if(success===2){
                                    
                                    res.json({boolconfirm:true,balanceconfirm:true,transfer:true})

                                }else if(success===1){


                                    res.json({boolconfirm:false,balanceconfirm:false,transfer:false})

                                }else{
                                    res.json({boolconfirm:true,balanceconfirm:false,transfer:false})
                                }
                            })

                        })
                    }
                })
            }else{
                //인증이 실패했다는 false를 보냄
                res.json({boolconfirm:true,balanceconfirm:false,transfer:false})
            }

        })

    })






})



router.post('/create', function (req, res) {

    var today = new Date()

    let body = req.body;

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
            console.log("데이터성공")

            res.send(JSON.stringify(result));
        })
        .catch(() => {
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
    }).catch(() =>{
        console.log("데이터 추가실패")
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
                buytoken:buycoin,
                status:0
            },
        }).then(result=>{
            res.json(
                result
            );
        }).catch(() =>{
            console.log("fail")
        })
    }else{
        models.TBoard.findAll({
            offset:offset,
            limit:10,
            where:{
                selltoken:sellcoin,
                buytoken:buycoin,
                status:0
            },
            order:[[method,order]]
        }).then(result=>{
            res.json(
                result
            );
        }).catch(() =>{
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
        }).catch((e)=>{
            res.status(404).send(e)
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
        }).catch(() =>{
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
        }).catch(()=>{
            console.log("실패");
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
        }).catch(() =>{
            console.log("fail")
        })
    }



})

// 거래 게시글 삭제
router.post('/delete', function (req, res) {
    models.TBoard.destroy({
        where: {

        }
    })
        .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(result));
        })
        .catch(() => {
            console.log("데이터 추가 실패");

        })
});

module.exports = router;
