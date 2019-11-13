const express = require('express');
const router = express.Router();

const web3 = require('../module/web3');

router.get('/test',(req,res)=>{
    web3.unlockAccount(addr,body.password).then((result)=>{
        console.log(result)
    })
    console.log("e");
})


module.exports =router;