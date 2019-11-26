const Web3 = require('web3')
var contract = require("truffle-contract")
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

function getUser(email) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.getInfo(email)
                .then((res) => {
                    return res
                })
        })
}

function addUser(email, strName, strPassWord, strAccount, EmailCheck) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.addInfo(email, strName, strPassWord, strAccount, EmailCheck, {from: "0x68Fb207bccf6063fEA145188787d4388A11b7592"})
                .then((res) => {
                    console.log(res)
                    return ({a: "true"})
                }).catch((e) => {
                console.log(e)
                return (e)
            })
        })
}

function updateUser(email, strName, strPassWord, strAccount, EmailCheck) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.updateInfo(email, strName, strPassWord, strAccount, EmailCheck, {from: "0x68Fb207bccf6063fEA145188787d4388A11b7592"})
                .then((res) => {
                    return res
                })
        })
}

function deleteUser(email) {
    return U_contract.deployed()
        .then(function (instance) {
            instance.removeInfo(email)
                .then((res) => {
                    return res
                })
        })
}

function createwallet(password) {
    return web3.eth.personal.newAccount(password)
}

function unlockAccount(addr, password) {
    return web3.eth.personal.unlockAccount(addr, password, 0)
}

async function signTest(addr, pass) {
    try {
        var res = await web3.eth.personal.sign("Hello world", addr, pass)
        console.log('sign res ', res)

        // recover the signing account address using original message and signed message

        return true
    } catch (e) {
        //console.error(e)
        console.log('recover fail')
        return false
    }
}

function getbalance(addr) {
    return new Promise(((resolve) => {
        let balances = [-1, -1, -1, -1]
        var BN = web3.utils.BN
        AT_contract.deployed().then(function (instance) {
            instance.balanceOf(addr)
                .then((data) => {
                    console.log(BN(data).toString())
                    balances[0] = new BN(data).toString()
                    if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                        resolve(balances)
                })
        })

        BT_contract.deployed().then(function (instance) {
            instance.balanceOf(addr)
                .then((data) => {
                    console.log(BN(data).toString())
                    balances[1] = new BN(data).toString()
                    if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                        resolve(balances)
                })
        })

        CT_contract.deployed().then(function (instance) {
            instance.balanceOf(addr)
                .then((data) => {
                    console.log(BN(data).toString())
                    balances[2] = new BN(data).toString()
                    if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                        resolve(balances)
                })
        })

        web3.eth.getBalance(addr)
            .then((data) => {
                console.log(data)
                balances[3] = new BN(data).toString()
                if (balances[0] !== -1 && balances[1] !== -1 && balances[2] !== -1 && balances[3] !== -1)
                    resolve(balances)
            })
    }))
}

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
                    return true
                }).catch(() => {
                    return false
                })
        }).then((result) => {
            return result
        })
}

async function tokenEthTransfer(ethAddr, ethBal, ethAmount, tokenAddr, tokenBal, TokenAmount, tokenContract) {
    if (ethAmount < parseInt(ethBal) && TokenAmount < parseInt(tokenBal)) {
        await web3.eth.sendTransaction({
            from: ethAddr,
            to: tokenAddr,
            value: ethAmount
        })
        await tokenTransfer(tokenContract, tokenAddr, ethAddr, TokenAmount)
        return true
    } else {
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
                userBal_1 = bal
                if (typeof (userBal_1) !== "undefined" && typeof (userBal_2) !== "undefined") {
                    resolve()
                }
            })
            tokenBal(token_2, tokenName, contract_2, contracts, addr_2, BN)
                .then((bal) => {
                    userBal_2 = bal[0]
                    contract_2 = bal[1]
                    if (typeof (userBal_1) !== "undefined" && typeof (userBal_2) !== "undefined") {
                        resolve()
                    }
                })
        }))
            .then(() => {
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

module.exports = {createwallet, getbalance, unlockAccount, transfer, signTest, getUser, addUser, updateUser, deleteUser}
