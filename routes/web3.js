const express = require('express');
const router = express.Router();

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
const BT_contract_json = fs.readFileSync(path.join(process.cwd(), "abi/BToken.json"), 'utf-8')
const CT_contract_json = fs.readFileSync(path.join(process.cwd(), "abi/CToken.json"), 'utf-8')

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

router.post('/transfer',(req,res)=>{
    const addr1 = req.body.addr1;
    const addr2 = req.body.addr2;
    const value = req.body.value;

   console.log("addr1 = ",addr1);
   console.log("addr2 = ",addr2);
   console.log("value = ",value);

    AT_contract.deployed().then(instance =>{
        instance.transfer(addr2,value,{from:addr1}).then(result=>{

        })
    })
    console.log("asdasdasdasdasd")
    BT_contract.deployed().then(instance =>{
        instance.transfer(addr2,value,{from:addr1}).then(result=>{

        })
    })
    console.log("asdasdasdasda111sd")


})

router.post('/getbalnace',(req,res)=>{
    var BN = web3.utils.BN
    const addr2 = req.body.addr2;
    let a = [];
    AT_contract.deployed().then(instance=>{
        instance.balanceOf(addr2).then((data)=>{
            const bc = new BN(data).toString()
                a.push(bc)
            BT_contract.deployed().then(instance=>{
                instance.balanceOf(addr2).then((data)=>{
                    const ka = new BN(data).toString();
                    a.push(ka)
                    res.json(a);
                })
            })
        })
    })


})



async function transfer(addr_1, token_1, token_1_value, addr_2, token_2, token_2_value) {
    const tokenName = ["ETH","Atoken", "Btoken", "Ctoken"]
    const contracts = [AT_contract, BT_contract, CT_contract]
    let contract_1
    let contract_2
    let userBal_1
    let userBal_2
    var BN = web3.utils.BN
    console.log('token_1_name type =',typeof (token_1))
    console.log('token_2_name type =',typeof (tokenName[1]))

    return new Promise(((resolve, reject) => {


        console.log("시작하자 ㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱ")
        if(token_1==="ETH" || token_2==="ETH"){

        }

        for (let i=0; i < tokenName.length; i++) {

            if (token_1 === tokenName[i]) {
                console.log('token_1_name =',(token_1))
                console.log('token_2_name  =',(tokenName[i]))
                console.log("시작하자 ㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱ")
                contract_1 = contracts[i]
                contract_1.deployed()
                    .then(function (instance) {
                        instance.balanceOf(addr_1)
                            .then((data) => {
                                console.log('BM ==',new BN(data).toString());
                                userBal_1 = new BN(data).toString()
                                for (let i=0; i < tokenName.length; i++) {
                                    if (token_2 === tokenName[i]) {
                                        contract_2 = contracts[i]
                                        contract_2.deployed()
                                            .then(function (instance) {
                                                instance.balanceOf(addr_2)
                                                    .then((data) => {
                                                        console.log('BM22 ==', new BN(data).toString());
                                                        userBal_2 = new BN(data).toString()
                                                        resolve()
                                                    })
                                            })
                                    }
                                }
                            })
                    })
            }

        }



    })).then(()=>{
        console.log('token_1_value type =',typeof (token_1_value))
        console.log('token_2_value type =',typeof (token_2_value))
        console.log('userBal_1 type =',typeof (userBal_1))
        console.log('userBal_2 type =',typeof (userBal_2))
        console.log('userBal_1 parse =',parseInt(userBal_1))
        console.log('userBal_2 parse =',parseInt(userBal_2))

        if (token_1_value < parseInt(userBal_1) && token_2_value < parseInt(userBal_2)) {
            console.log("트랜스퍼 들어오는가용?");
            contract_1.deployed()
                .then(function (instance) {
                    instance.transfer(addr_2, token_1_value, {from: addr_1})
                    contract_2.deployed()
                        .then(function (instance) {
                            instance.transfer(addr_1, token_2_value, {from: addr_2})
                                .then(() => {
                                    return true;
                                })
                        })
                })

        } else {
        return false;
        }
    })


}

router.post('/test',(req,res)=>{
    addr_1 = req.body.addr1;
    addr_2 = req.body.addr2;
    token_1 = req.body.token_1;
    token_2 = req.body.token_2;
    token_1_value = req.body.token_1_value;
    token_2_value = req.body.token_2_value;
    transfer(addr_1, token_1, token_1_value, addr_2, token_2, token_2_value)
})


module.exports =router;