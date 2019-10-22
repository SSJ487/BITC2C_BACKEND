'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let datas =[]
    let methodname;
    
    for(let i =0;i<100;i++){

      if(i%2==0){
        methodname="sell";
      }else{
        methodname="buy";
      }
      
      const priceRandom = parseInt(Math.random() * (10000000-10000)+10000)
      const statusRandom = parseInt(Math.random() * (3-0)+0 )
      
      let obj={
        type:"bitcoin",
        amount:i,
        price:priceRandom,
        method:methodname,
        status:statusRandom,
        createdAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        SellerId:i,
        buyerId:i+1
      }
      datas.push(obj)
    }
    return queryInterface.bulkInsert('TBoards',datas,{});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('TBoards',null,{});
  }
};
