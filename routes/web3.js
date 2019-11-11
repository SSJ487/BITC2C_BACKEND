const express = require('express');
const router = express.Router();

const web3 = require('../module/web3');


router.get('/test',(req,res)=>{
    console.log("e");
   res.json(web3.callcontract())


})

router.get('/balance',(req,res)=>{
    console.log("asf");
    res.json(web3.getbalance())

})




module.exports =router;