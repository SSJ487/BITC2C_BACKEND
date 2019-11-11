const Web3 = require('web3');
var contract = require("truffle-contract");
const util = require('util');
const assert = require('assert')
const fs = require('fs');

var web3Provider = new Web3.providers.HttpProvider('http://192.168.1.179:22000');
var web3 = new Web3(web3Provider);

const At_contract = fs.readFileSync('/home/marf/workspace/work/bitc2c/BITC2C_BACKEND/abi/AToken.json', 'utf-8');
const abi = JSON.parse(At_contract);
let myContract = new web3.eth.Contract(abi.abi, "0xa2170a698d0fad2542731ed0838c185f312b5843");

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

At_contract.setProvider(web3Provider);

function createwallet(password){
    return web3.eth.personal.newAccount(password)
}

function getbalance(address){
    return web3.eth.getBalance(address)
}


module.exports ={createwallet,getbalance,callcontract}