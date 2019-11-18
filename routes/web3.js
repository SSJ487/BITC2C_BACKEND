const express = require('express')
const router = express.Router()

const Web3 = require('web3')
var contract = require("truffle-contract")
const util = require('util')
const assert = require('assert')
const fs = require('fs')
var path = require("path")
path.join(process.cwd(), "abi/AToken.json")


var web3Provider = new Web3.providers.HttpProvider('http://b3b11115.ngrok.io')
var web3 = new Web3(web3Provider)


const UserCrud_json = fs.readFileSync(path.join(process.cwd(), "abi/AToken.json"), 'utf-8')

const AT_contract_json = fs.readFileSync(path.join(process.cwd(), "abi/AToken.json"), 'utf-8')
const BT_contract_json = fs.readFileSync(path.join(process.cwd(), "abi/Btoken.json"), 'utf-8')
const CT_contract_json = fs.readFileSync(path.join(process.cwd(), "abi/Ctoken.json"), 'utf-8')

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


router.get('/test', (req, res) => {
    console.log("e")
    res.json(web3.callcontract())
})

router.get('/balance', (req, res) => {
    web3.eth.accounts().then((result) => {
        res.json(result)
    })

})

router.post('/unlock', (req, res) => {

    web3.eth.personal.unlockAccount(req.body.addr, req.body.password).then((result) => {
        console.log('result =>', result)
        res.json(result)
    })


})

router.post('/tokensign', (req, res) => {
    const addr = req.body.addr
    const password = req.body.password

    web4.signTest(addr, password).then((result) => {
        console.log(result)
        res.json(result)
    })


})

router.post('/transfer', (req, res) => {
    const addr1 = req.body.addr1
    const addr2 = req.body.addr2
    const value = req.body.value

    console.log("addr1 = ", addr1)
    console.log("addr2 = ", addr2)
    console.log("value = ", value)

    AT_contract.deployed().then(instance => {
        instance.transfer(addr2, value, {from: addr1}).then(result => {

        })
    })
    console.log("asdasdasdasdasd")
    BT_contract.deployed().then(instance => {
        instance.transfer(addr2, value, {from: addr1}).then(result => {

        })
    })
    console.log("asdasdasdasda111sd")


})

router.post('/getbalnace', (req, res) => {
    var BN = web3.utils.BN
    const addr2 = req.body.addr2
    let a = []
    AT_contract.deployed().then(instance => {
        instance.balanceOf(addr2).then((data) => {
            const bc = new BN(data).toString()
            a.push(bc)
            BT_contract.deployed().then(instance => {
                instance.balanceOf(addr2).then((data) => {
                    const ka = new BN(data).toString()
                    a.push(ka)
                    res.json(a)
                })
            })
        })
    })
})


async function tokenBal(tokenName, tokenArray, contract, contractArray, addr, BN) {
    for (let i = 0; i < tokenArray.length; i++) {
        let result;
        if (tokenName === tokenArray[i]) {
            contract = contractArray[i]
            await contract.deployed()
                .then(async function (instance) {
                    await instance.balanceOf(addr)
                        .then((data) => {
                            result = [new BN(data).toString(), contractArray[i]]
                        })
                })
        }
        return result
    }
}

async function tokenTransfer(contract, fromUser, toUser, amount) {
    return await contract.deployed()
        .then(async function (instance) {
            await instance.transfer(toUser, amount, {from: fromUser})
                .then(() => {
                    console.log("token Tanse ffff asdfunction")
                    return true
                }).catch(() => {
                    return false
                })
        }).then((result) => {
            return result
        })


}

async function tokenEthTransfer(ethAddr, ethBal, ethAmount, tokenAddr, tokenBal, TokenAmount, tokenContract) {
    console.log("qwdqwdwdqwd")
    console.log("ethAmount = ", ethAmount)
    console.log("tokenAmount = ", TokenAmount)
    console.log("ethbal = ", ethBal)
    console.log("tokenbal = ", tokenBal)
    if (ethAmount < parseInt(ethBal) && TokenAmount < parseInt(tokenBal)) {
        console.log("tokenethtransfer")
        await web3.eth.sendTransaction({
            from: ethAddr,
            to: tokenAddr,
            value: ethAmount
        })
        console.log("toeknethrtarns====")
        await tokenTransfer(tokenContract, tokenAddr, ethAddr, TokenAmount)
        return true
    } else {
        console.log("token Eth Tra nnnnn")
        return false
    }
}

async function transfer(addr_1, token_1, token_1_value, addr_2, token_2, token_2_value) {
    const tokenName = ["Atoken", "Btoken", "Ctoken"]
    const contracts = [AT_contract, BT_contract, CT_contract]
    let contract_1
    let contract_2
    let userBal_1
    let userBal_2
    var BN = web3.utils.BN
    if (token_1 !== "ETH" && token_2 !== "ETH") {
        console.log("transfer11 ===========")
        return new Promise(((resolve) => {
            tokenBal(token_1, tokenName, contract_1, contracts, addr_1, BN)
                .then((bal) => {
                    userBal_1 = bal[0]
                    contract_1 = bal[1]
                })
            tokenBal(token_2, tokenName, contract_2, contracts, addr_2, BN)
                .then((bal) => {
                    userBal_2 = bal[0]
                    contract_2 = bal[1]
                })
            if (userBal_1 !== null && userBal_2 !== null) {
                resolve()
            }
        }))
            .then(() => {
                return new Promise((resolve) => {
                    if (token_1_value < parseInt(userBal_1) && token_2_value < parseInt(userBal_2)) {
                        tokenTransfer(contract_1, addr_1, addr_2, token_1_value)
                            .then(() =>
                                tokenTransfer(contract_2, addr_2, addr_1, token_2_value)
                                    .then(() => resolve(true))
                            )
                    } else {
                        resolve(false)
                    }
                })
            })
    } else if (token_1 === "ETH") {
        return new Promise((resolve => {
            web3.eth.getBalance(addr_1).then((bal) => {
                console.log("bal ====", bal)
                userBal_1 = bal
                if (typeof (userBal_1) !== "undefined" && typeof (userBal_2) !== "undefined") {
                    resolve()
                }
            })
            tokenBal(token_2, tokenName, contract_2, contracts, addr_2, BN)
                .then((bal) => {
                    console.log("tokenball ====", bal[0])
                    userBal_2 = bal[0]
                    contract_2 = bal[1]
                    if (typeof (userBal_1) !== "undefined" && typeof (userBal_2) !== "undefined") {
                        resolve()
                    }
                })
        }))
            .then(() => {
                console.log('asdfasdf11', userBal_2)
                return new Promise((resolve, reject) => {
                    resolve(tokenEthTransfer(addr_2, userBal_2, token_2_value, addr_1, userBal_1, token_1_value, contract_2))
                })

            })
    } else if (token_2 === "ETH") {
        return new Promise((resolve => {
            web3.eth.getBalance(addr_2).then((bal) => {
                userBal_2 = bal
                if (userBal_1 !== null && userBal_2 !== null) {
                    resolve()
                }
            })
            tokenBal(token_1, tokenName, contract_1, contracts, addr_1, BN)
                .then((bal) => {
                    userBal_1 = bal[0]
                    contract_1 = bal[1]
                    if (userBal_1 !== null && userBal_2 !== null) {
                        resolve()
                    }
                })

        }))
            .then(() => {
                return new Promise((resolve, reject) => {
                    resolve(tokenEthTransfer(addr_2, userBal_2, token_2_value, addr_1, userBal_1, token_1_value, contract_1))
                })
            })
    }
}

router.post('/test', (req, res) => {
    addr_1 = req.body.addr1
    addr_2 = req.body.addr2
    token_1 = req.body.token_1
    token_2 = req.body.token_2
    token_1_value = req.body.token_1_value
    token_2_value = req.body.token_2_value

    transfer(addr_1, token_1, token_1_value, addr_2, token_2, token_2_value).then((result) => {
        console.log('test////', result)
        res.json(result)
    })
})


module.exports = router