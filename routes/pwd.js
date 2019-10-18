var express = require('express');
const models = require('../models');
var bcrypt = require('bcrypt');
var router = express.Router();
const nodemailer = require('nodemailer');
//To store token in cookies


router.post('/change', (req, res, next) => {
    let body = req.body;
    models.User.findOne({
        where: {
            email: req.body.email
        }
    }).then((user) => {
        console.log(user);
        if (!user) {
            console.log("NOBODY!!!!");
            res.redirect('/');
        } else {
            console.log("FOUND ONE")
            bcrypt.compare(body.password, user.password, (err, result) => {
                if (result == true) {
                    console.log("true!!!!!!!!!");

                    res.send(updatepw(body.email, body.newpassword));
                }
                else {
                    res.send("비밀번호가 틀렸습니다.");
                }
            })
        }
    })
})

function updatepw(email, newpassword){
    console.log(email, newpassword);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var string ="";


    today = mm + '/' + dd + '/' + yyyy;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log('bcrypt.genSalt() errer:', err.message)
        } else {
            bcrypt.hash(newpassword, salt, (err, hash) => {
                console.log(hash);

                models.User.update({
                    password: hash,
                    updatedAt: today
                }, {
                    where: {
                        email: email,
                    }
                }).then(result => {
                    console.log(result, "pw 변경완료");
                    string = "변경완료";
                }).catch(err => {
                    console.log("에러!!!!!!!!!!!!!!!!!!");
                    console.log(err);
                    string = "변경실패";
                });
            })
        }
    })

    return string;
}


//crypto confirm
router.post('/forgot', (req, res, next) => {
    let body = req.body;
    console.log(req.body.email)
    models.User.findOne({
        where: {
            email: body.email,
            phone: body.phone
        }
    }).then((user) => {
        console.log(user);
        if (!user) {
            res.send("입력정보 오류!!!!");
        } else {
            savetmppw(body.email);
        }
    })
})


function savetmppw(email) {
    var tmppwd = randomString();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log('bcrypt.genSalt() errer:', err.message)
        } else {
            bcrypt.hash(tmppwd, salt, (err, hash) => {
                models.User.update({
                    password: hash,
                    emailcheck: "0"
                }, {
                    where: {
                        email: email
                    }
                }).then((result) => {
                    console.log(result);
                    if (!result) {
                        res.send("임시비밀번호 저장 오류!!!!");
                    } else {
                        sendemail(email, tmppwd);
                    }
                })
            })
        }
    });

    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$&*";
        var string_length = 8;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        console.log(randomString);
        //document.randform.randomfield.value = randomstring;
        return randomstring;
    }

    function sendemail(email, tmppwd) {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'a01026879718@gmail.com',  // gmail 계정 아이디를 입력
                pass: 'a01026879718'          // gmail 계정의 비밀번호를 입력
            }
        });

        let mailOptions = {
            from: 'a01026879718@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
            to: email,                     // 수신 메일 주소
            subject: '안녕하세요, OOOO입니다. 이메일 인증을 해주세요.',
            html: '<p>임시비밀번호 발급: ' + tmppwd + '</p>' +
                '<p>비밀번호를 변경해 주세요!</p>' +
                "<a href='http://localhost:5555/emailcheck/?email=" + email + "'>인증하기</a>"
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
                res.send(info.response);
            }
        });

    }
}


module.exports = router;

