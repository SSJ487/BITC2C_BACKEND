const Web3 = require('web3');
var contract = require("truffle-contract");
const util = require('util');
const assert = require('assert')
const fs = require('fs');


var web3Provider = new Web3.providers.HttpProvider('http://192.168.1.179:22000');
var web3 = new Web3(web3Provider);

const tt_contract_json = fs.readFileSync('../abi/AToken.json', 'utf-8');

const abi = JSON.parse(tt_contract_json);

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

var tt_contract = contract(abi);
tt_contract.setProvider(web3Provider);

var myaddr =  "0x68fb207bccf6063fea145188787d4388a11b7592";
var tt_contract_addr;

function createwallet(password){
    return web3.eth.personal.newAccount(password)
}

function getbalance(address){

    return web3.eth.getBalance(address)
}

function callcontract(){
    tt_contract.deployed().then(function(instance) {


        console.log('asdfasfe', instance.transfer("0x29296876bc0f39217c1869c0e6890bf8b028d8ce",10,{from:myaddr, }).then((data)=>
        {
            console.log('wefqef',data)
        }))
    }).then(function(value) {
        console.log('result', value.toNumber())

    }).catch(function(err) {
        console.log(err.message);

    });




}

function getbalance(){
    var BN = web3.utils.BN;
    tt_contract.deployed().then(function(instance) {


        console.log('asdfqweasfe', instance.balanceOf("0x29296876bc0f39217c1869c0e6890bf8b028d8ce").then((data)=>
        {
            console.log('wefqweqeasdf',new BN(data).toNumber())
        }))
    }).catch(function(err) {
        console.log(err.message);

    });
}
module.exports ={createwallet,getbalance,callcontract}