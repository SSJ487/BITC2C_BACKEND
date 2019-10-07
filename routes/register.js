const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', function (req, res, next) {
    let email = req.body.email;

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
        html: '<p>아래의 링크를 클릭해주세요 !</p>' +
            "<a href='http://localhost:3000/emailcheck/?email=" + email + "'>인증하기</a>"
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

})

module.exports = router;