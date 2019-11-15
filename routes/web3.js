const express = require('express');
const router = express.Router();


const Web3 = require('web3')
var contract = require("truffle-contract")
const util = require('util')
const assert = require('assert')
const fs = require('fs')

var web3Provider = new Web3.providers.HttpProvider('http://b3b11115.ngrok.io')
var web3 = new Web3(web3Provider)
const web4 = require('../module/web3');


router.get('/test',(req,res)=>{
    console.log("e");
   res.json(web3.callcontract())
})

router.get('/balance',(req,res)=>{
    web3.eth.accounts().then((result)=>{
        res.json(result);
    })

})

router.post('/unlock',(req,res)=>{

    web3.eth.personal.unlockAccount(req.body.addr,req.body.password).then((result)=>{
        console.log('result =>',result)
        res.json(result);
    })


})

router.post('/tokensign',(req,res)=>{
    const addr = req.body.addr;
    const password = req.body.password;

    web4.signTest(addr,password).then((result)=>{
        console.log(result);
        res.json(result);
    })

 

})

module.exports =router;