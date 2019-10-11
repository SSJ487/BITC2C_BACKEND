var express = require('express');
const models = require('../models');
var bcrypt = require('bcrypt');
var router = express.Router();



router.post('/', (req, res, next) => {
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


module.exports = router;