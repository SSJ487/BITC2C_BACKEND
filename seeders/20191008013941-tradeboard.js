'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let datas =[]
    let methodname;

    const coindata = ["ETH","Atoken","Btoken","Ctoken"];
    const coindata1 = ["ETH","Atoken","Btoken","Ctoken"];
    for(let i =0;i<250;i++){

      if(i%2==0){
        methodname="sell";
      }else{
        methodname="buy";
      }
      
      const priceRandom = parseInt(Math.random() * (10000000-10000)+10000)
      const statusRandom = parseInt(Math.random() * (3-0)+0 )
      const amountRandom = parseInt(Math.random() *(10000 -10) +10)
      const amountRandom1 = parseInt(Math.random() *(10000 -10) +10)
      const coindatarandom1=parseInt(Math.random() * (4-0)+0 )
      const coindatarandom2=parseInt(Math.random() * (4-0)+0 )
      const sellbuyrandom = parseInt(Math.random()*(2-0)+0);
      let sellid =0;
      let buyid =0;
      if(sellbuyrandom===0){
        sellid =1;
        buyid =null;
      }else{
        buyid=1;
        sellid=null;
      }
    
      let obj={
        selltoken:coindata[coindatarandom1],
        buytoken:coindata1[coindatarandom2],
        selltokenamount:amountRandom,
        buytokenamount:amountRandom1,
        contractwallet:"asdfasdf",
        status:statusRandom,
        createdAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        SellerId:sellid,
        buyerId:buyid,
        Expirydate:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      }
      datas.push(obj)
    }
    return queryInterface.bulkInsert('TBoards',datas,{});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('TBoards',null,{});
  }
};
