var express = require('express');
const models = require('../models');
var router = express.Router();


// 모든 회원정보 출력
router.get('/users', (req, res, next) => {
    
    models.User.findAll({
        where: {
            emailcheck: '1'
        }
    }).then((users) => {
        console.log(users);
        if (!users) {
            console.log("NOBODY!!!!");
            res.redirect('/');
        } else {
            console.log("FOUND ALL")
            res.send(users);
        }
    })
})

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


// 회원 검색
router.get('/user', (req, res, next) => {

    models.User.findOne({
        where: {
            emailcheck: '1',
            email: req.body.email,
        }
    }).then((user) => {
        console.log(user);
        if (!user) {
            console.log("NOBODY!!!!");
            res.redirect('/');
        } else {
            console.log("FOUND ONE")
            res.send(user);
        }
    })
})

// 회원 일시정지        ??????????????????????
// router.get('/', (req, res, next) => {

//     models.User.findOne({
//         where: {
//             emailcheck: '1',
//             email: req.body.email,
//         }
//     }).then((user) => {
//         console.log(user);
//         if (!user) {
//             console.log("NOBODY!!!!");
//             res.redirect('/');
//         } else {
//             console.log("FOUND ONE")
//             res.send(user);
//         }
//     })
// })


// 회원 삭제    ?????????
// router.get('/user', (req, res, next) => {

//     models.User.findOne({
//         where: {
//             emailcheck: '1',
//             email: req.body.email,
//         }
//     }).then((user) => {
//         console.log(user);
//         if (!user) {
//             console.log("NOBODY!!!!");
//             res.redirect('/');
//         } else {
//             console.log("FOUND ONE")
//             res.send(user);
//         }
//     })
// })

module.exports = router;