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


        }else{
            return false;
        }
    })
}



module.exports ={exchange}