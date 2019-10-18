var express = require('express');
var router = express.Router();
const models = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;

// 유저 정보만 가져옴
router.get('/user', function (req, res) {

    models.User.findOne({
        where: {
            email: req.body.email
        }
    }).then((user) => {
        console.log(user);
        if (!user) {
            res.redirect('/');
        } else {
            res.json(user);
        }
    })
});

// 해당 userId가 들어간 거래정보들 가져옴
router.get('/tboard', function (req, res) {
    models.TBoard.findAll({
        where: {
            [Op.or]: [
                {
                    sellerId: req.body.userId
                },
                {
                    buyerId: req.body.userId
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
            UserId: req.body.userId
        }
    }).then((wallet) => {
        console.log(wallet);
        if (!wallet) {
            res.redirect('/');
        } else {
            res.json(wallet);
        }
    })
});


module.exports = router;