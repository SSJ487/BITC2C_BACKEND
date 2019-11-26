var express = require('express');
var router = express.Router();
const models = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;
const web3 = require('../module/web3');
// 유저 정보만 가져옴
router.get('/user', function (req, res) {
    models.User.findOne({
        where: {
            id: req.param('id')
        }
    }).then((user) => {
        ("user: ", user);
        if (!user) {
            res.status(404).send('User is not exist');
        } else {
            res.json({
                id: user.dataValues.id,
                name: user.dataValues.name,
                email: user.dataValues.email,
                phone: user.dataValues.phone,
                point: user.dataValues.point,
                createdAt: user.dataValues.createdAt
            });
        }
    }).catch((e) =>{
        res.status(401).send(e)
    })
});

router.get('/getbalance',function(req,res){
    const addr = req.param('address')
    web3.getbalance(addr).then((balance) =>{

        res.json(balance);
    })
})

// 해당 userId가 들어간 거래정보들 가져옴
router.get('/tboard', function (req, res) {
    models.TBoard.findAll({
        where: {
            [Op.or]: [
                {
                    sellerId: req.param('id')
                },
                {
                    buyerId: req.param('id')
                }
            ]
        }
    }).then((board) => {
        (board);
        if (!board) {
            res.status(404).send('거래 정보가 없습니다.');
        } else {
            res.json(board);
        }
    })
})


router.get('/tboards',function(req,res){


    const query = 'select A.selltoken,A.buytoken,A.status as tbst,B.status as orst,A.selltokenamount,A.buytokenamount,A.createdAt,B.createdAt from TBoards as A join orderbooks as B on (A.id=1 and B.TableId=1) and (A.SellerId || A.buyerId =:Id);'
    var values = {
        Id: req.param('id')
    }
    models.sequelize.query(query, { raw:true,replacements: values ,type:models.sequelize.QueryTypes.SELECT}).spread((results, metadata) => {


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
// 유저의 자산 코인별로 가져옴
router.get('/wallet', function (req, res) {
    models.Wallet.findAll({
        where: {
            UserId: req.param('id')
        }
    }).then((wallet) => {
        if (!wallet) {
            res.status(404)('유저 지갑이 없습니다.');
        } else {
            res.json(wallet);
        }
    }).catch(err => {
        (err, "지갑에러");
        res.json({data: {type:'', address: '', amount:''}});
    });
});


module.exports = router;
