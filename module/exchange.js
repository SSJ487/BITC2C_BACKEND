function exchange(models,tableid,web3) {

    return new Promise((resolve, reject)=>{
        console.log('table id ====',tableid)
        models.orderbook.findOne({
            where :{
                TableId : tableid,
                status :{
                    [models.Sequelize.Op.lt] :3
                }

            }
        }).then((result)=>{
            console.log('exchange =====',result.status)

            if(result.status ===2){
                const query = 'select A.address as selladdr ,B.address as buyaddr ,C.selltoken as selltoken,C.buytoken as buytoken,C.selltokenamount as sellamount,C.buytokenamount as buyamount from Wallets as A ,Wallets as B ,orderbooks as C where A.UserId = sellerconfirm and B.UserId = buyerconfirm';
                models.sequelize.query(query,{type:models.sequelize.QueryTypes.SELECT}).spread((results, metadata)=>{
                    web3.transfer(results.selladdr,results.selltoken,results.sellamount,results.buyaddr,results.buytoken,results.buyamount).then(bool=>{
                        console.log("booooolllllllllll",bool);

                        if(bool){
                            models.orderbook.update({
                                status:3
                            },{
                                where :{
                                    TableId : tableid,
                                    status :{
                                        [models.Sequelize.Op.lt] :3
                                    }

                                }
                            }).then(()=>{
                                models.TBoard.update({
                                    status:2
                                },{
                                    where:{
                                        id:tableid
                                    }
                                })
                            })
                            resolve(2)
                        }else{
                            models.TBoard.update({
                                status:0,
                                buyerId:0
                            },{
                                where:{
                                    id:tableid
                                }
                            }).then(()=>{
                                models.orderbook.update({
                                    status:5
                                },{
                                    where:{
                                        TableId:tableid
                                    }
                                })
                            }).then(()=>{

                                resolve(1)
                            })
                        }
                    });
                })







            }else{
                resolve(3);
            }
        })
    })

}



module.exports ={exchange}