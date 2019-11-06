var express = require('express');
const models = require('../models');
var router = express.Router();


// 포스트맨으로 데이터 던질때 이용
router.post('/create', function (req, res, next) {
    let body = req.body;

    models.Alarm.create({
        status: '0',
        socketId: req.body.socketId,
        UserId: req.body.UserId,
    })
        .then(result => {
            res.send(JSON.stringify(result));
        })
        .catch(err => {

            var error = JSON.stringify(err);
            error = JSON.parse(error);

            if (error.name == "SequelizeUniqueConstraintError") {
                res.send("wallet 주소 중복 에러!!!");
            } else if (error.name == "SequelizeForeignKeyConstraintError") {
                res.send("외래키 제약 에러!!!");
            }
        })
});

// 로그인 버튼 누를시 동작
function create(socketId, UserId) {
    console.log("alarm creat@@@@###: ", UserId);
    models.Alarm.findAll({
        where: {
            UserId: UserId
        }
    }).then((user) => {
        console.log("user: ", user);
        if (user.length()==0) {
            console.log("new create!!!!");

            models.Alarm.create({
                status: '0',
                socketId: socketId,
                UserId: UserId,
            })
                .then(result => {
                    res.send(JSON.stringify(result));
                })
                .catch(err => {

                    var error = JSON.stringify(err);
                    error = JSON.parse(error);

                    if (error.name == "SequelizeUniqueConstraintError") {
                        res.send("Userid 주소 중복 에러!!!");
                    } else if (error.name == "SequelizeForeignKeyConstraintError") {
                        res.send("외래키 제약 에러!!!");
                    }
                })
        } else {
            console.log("alarm update socketID!!!!");
            models.Alarm.update({
                socketId: socketId
            }, {
                where: {
                    UserId: UserId
                }
            }).then(result => {
                    res.send(JSON.stringify(result));
                })
                .catch(err => {

                    var error = JSON.stringify(err);
                    error = JSON.parse(error);

                    if (error.name == "SequelizeUniqueConstraintError") {
                        res.send("Userid 주소 중복 에러!!!");
                    } else if (error.name == "SequelizeForeignKeyConstraintError") {
                        res.send("외래키 제약 에러!!!");
                    }
                })
        }
    })
};

function find(UserId) {
    return models.Alarm.findOne({
        where: {
            UserId: UserId
        }
    })
};

module.exports = {router, create, find};