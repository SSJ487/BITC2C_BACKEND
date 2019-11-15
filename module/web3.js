const Web3 = require('web3')
var contract = require("truffle-contract")
const util = require('util')
const assert = require('assert')
const fs = require('fs')

var web3Provider = new Web3.providers.HttpProvider('http://192.168.1.179:22000')
var web3 = new Web3(web3Provider)

const AT_contract_json = fs.readFileSync('C:/Users/user/Desktop/프로젝트/backend/abi/AToken.json', 'utf-8')
const BT_contract_json = fs.readFileSync('C:/Users/user/Desktop/프로젝트/backend/abi/Btoken.json', 'utf-8')
const CT_contract_json = fs.readFileSync('C:/Users/user/Desktop/프로젝트/backend/abi/Ctoken.json', 'utf-8')

const ATabi = JSON.parse(AT_contract_json)
const BTabi = JSON.parse(BT_contract_json)
const CTabi = JSON.parse(CT_contract_json)


Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

const AT_contract = contract(ATabi)
const BT_contract = contract(BTabi)
const CT_contract = contract(CTabi)


AT_contract.setProvider(web3Provider)
BT_contract.setProvider(web3Provider)
CT_contract.setProvider(web3Provider)

function createwallet(password) {
    return web3.eth.personal.newAccount(password)
}

function callcontract() {
    tt_contract.deployed().then(function (instance) {

        console.log('asdfasfe', instance.transfer("0x29296876bc0f39217c1869c0e6890bf8b028d8ce", 10, {from: myaddr}).then((data) => {
            console.log('wefqef', data)
        }))
    }).then(function (value) {
        console.log('result', value.toNumber())

    }).catch(function (err) {
        console.log(err.message)
    })
}

function getbalance(addr) {
    return new Promise(((resolve, reject) => {
        let balances = [-1, -1, -1, -1]
        var BN = web3.utils.BN
        AT_contract.deployed().then(function (instance) {
            instance.balanceOf(addr)
                .then((data) => {
                    console.log(BN(data).toNumber())
                    balances[0] = new BN(data).toNumber()
                    if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                        resolve(balances)
                })
        })

        BT_contract.deployed().then(function (instance) {
            instance.balanceOf(addr)
                .then((data) => {
                    console.log(BN(data).toNumber())
                    balances[1] = new BN(data).toNumber()
                    if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                        resolve(balances)
                })
        })

        CT_contract.deployed().then(function (instance) {
            instance.balanceOf(addr)
                .then((data) => {
                    console.log(BN(data).toNumber())
                    balances[2] = new BN(data).toNumber()
                    if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                        resolve(balances)
                })
        })

        web3.eth.getBalance(addr)
            .then((data)=>{
                console.log(data)
                balances[3] = new BN(data).toNumber()
                if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                    resolve(balances)
            })
    }))
}

module.exports = {createwallet, getbalance, callcontract}