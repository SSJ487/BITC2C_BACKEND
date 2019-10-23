var express = require('express');
var router = express.Router();
const models = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;

// 유저 정보만 가져옴
router.get('/user', function (req, res) {

    models.User.findOne({
        where: {
            id: req.param('id')
        }
    }).then((user) => {
        console.log("user: ",user);
        if (!user) {
            res.redirect('/');
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
    })
});

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
        console.log(board);
        if (!board) {
            res.redirect('/');
        } else {
            res.json(board);
        }
    })
});

// 유저의 자산 코인별로 가져옴
router.get('/wallet', function (req, res) {
    models.Wallet.findAll({
        where: {
            UserId: req.param('id')
        }
    }).then((wallet) => {
        console.log("wallet: ",wallet);
        if (!wallet) {
            res.redirect('/');
        } else {
            res.json(wallet);
        }
    }).catch(err => {
        console.log(err, "지갑에러");
        res.send({data: "지갑없음"});
    });
});


module.exports = router;
