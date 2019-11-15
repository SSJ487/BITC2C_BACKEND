const Web3 = require('web3')
var contract = require("truffle-contract")
const util = require('util')
const assert = require('assert')
const fs = require('fs')

var web3Provider = new Web3.providers.HttpProvider('http://192.168.1.179:22000')
var web3 = new Web3(web3Provider)


const UserCrud_json = fs.readFileSync('/Users/johyeong/Documents/workplace/team3/backend/BITC2C_BACKEND/abi/UserCrud.json', 'utf-8')

const AT_contract_json = fs.readFileSync('/Users/johyeong/Documents/workplace/team3/backend/BITC2C_BACKEND/abi/AToken.json', 'utf-8')
const BT_contract_json = fs.readFileSync('/Users/johyeong/Documents/workplace/team3/backend/BITC2C_BACKEND/abi/Btoken.json', 'utf-8')
const CT_contract_json = fs.readFileSync('/Users/johyeong/Documents/workplace/team3/backend/BITC2C_BACKEND/abi/Ctoken.json', 'utf-8')

const U = JSON.parse(UserCrud_json)

const ATabi = JSON.parse(AT_contract_json)
const BTabi = JSON.parse(BT_contract_json)
const CTabi = JSON.parse(CT_contract_json)


Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

const U_contract = contract(U)

const AT_contract = contract(ATabi)
const BT_contract = contract(BTabi)
const CT_contract = contract(CTabi)

U_contract.setProvider(web3Provider)
AT_contract.setProvider(web3Provider)
BT_contract.setProvider(web3Provider)
CT_contract.setProvider(web3Provider)

function getUser(email) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.getInfo(email)
                .then((res)=>{
                    return res
                })
        })
}

function addUser(email, strName, strPassWord, strAccount, EmailCheck) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.addInfo(email, strName, strPassWord, strAccount, EmailCheck, {from: "0x68Fb207bccf6063fEA145188787d4388A11b7592"})
                .then((res)=>{
                    console.log(res)
                    return ({a:"true"})
                }).catch((e)=>{
                    console.log(e)
                    return (e)
            })
        })
}

function updateUser(email, strName, strPassWord, strAccount, EmailCheck) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.updateInfo(email, strName, strPassWord, strAccount, EmailCheck, {from: "0x68Fb207bccf6063fEA145188787d4388A11b7592"})
                .then((res)=>{
                    return res
                })
        })
}

function deleteUser(email) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.removeInfo(email)
                .then((res)=>{
                    return res
                })
        })
}

function createwallet(password) {
    return web3.eth.personal.newAccount(password)
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

module.exports = {createwallet, getbalance, getUser, addUser, updateUser, deleteUser}