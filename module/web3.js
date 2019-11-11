const Web3 = require('web3');
var contract = require("truffle-contract");
const util = require('util');
const assert = require('assert')
const fs = require('fs');



var web3Provider = new Web3.providers.HttpProvider('http://192.168.1.179:22000');
var web3 = new Web3(web3Provider);



function createwallet(password){
    return web3.eth.personal.newAccount(password)
}

function getbalance(address){

    return web3.eth.getBalance(address)
}

function callcontract(){
    const tt_contract_json = fs.readFileSync('C:/Users/user/Desktop/Atoken/build/contracts/Atoken.json');

}
module.exports ={createwallet,getbalance,callcontract}