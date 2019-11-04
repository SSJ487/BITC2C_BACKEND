const express = require('express');
const router = express.Router();
const Web3 = require('web3');
var contract = require("truffle-contract");
const util = require('util');
const assert = require('assert')

var web3Provider = new Web3.providers.HttpProvider('http://192.168.1.179:22000');
var web3 = new Web3(web3Provider);

router.post('/create',(req,res)=>{
    web3.eth.personal.newAccount(req.body.walletpassword).then((response)=>{

    })
 
    res.json('dongwan');

})


module.exports =router;