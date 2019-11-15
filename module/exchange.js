function exchange(models,tableid,web3) {
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
            const query = 'select A.address as selladdr ,B.address as buyaddr ,C.selltoken,C.buytoken,C.selltokenamount,C.buytokenamount from Wallets as A ,Wallets as B ,orderbooks as C where A.UserId = sellerconfirm and B.UserId = buyerconfirm';
            models.sequelize.query(query,{type:models.sequelize.QueryTypes.SELECT}).spread((results, metadata)=>{
                web3
            })


        }else{
            return false;
        }
    })
}



module.exports ={exchange}