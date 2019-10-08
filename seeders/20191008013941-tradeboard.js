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
      console.log(methodname);

      let obj={
        type:"bitcoin",
        amount:i,
        price:i*10000,
        method:methodname,
        status:0,
        createdAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        SellerId:i,
        buyerId:i+1
      }
      datas.push(obj)
    }
    return queryInterface.bulkInsert('TBoard',datas,{});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
