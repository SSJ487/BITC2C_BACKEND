const express = require('express');
const router = express.Router();

const web3 = require('../module/web3');

router.get('/getuser', function (req,res) {
    const body = req.body

    console.log(body.email)
    web3.getUser(body.email).then((data)=>{
            res.send(data)
        })
})

router.post("/adduser", function (req, res) {
    const body = req.body
    console.log(body)
    web3.addUser(body.email, body.strName, body.strPassWord, body.strAccount, body.EmailCheck)
        .then((data)=>{
        res.send(data)
    })

})


module.exports =router;