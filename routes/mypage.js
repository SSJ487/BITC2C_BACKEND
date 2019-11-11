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
        ("user: ",user);
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
        console.log("return", balance)
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
