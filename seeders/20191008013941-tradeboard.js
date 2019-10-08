'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let datas =[]
    let methodname;
    
    for(let i =0;i<10;i++){

      if(i%2==0){
        methodname=sell;
      }else{
        methodname=buy;
      }


      let obj={
        type:"bitcoin",
        amount:i,
        price:i*10000,
        method:methodname,
        status:Math.random*(3-0)+0,
        createdAt:new Date().toISOString().replace(/T/,'').replace(/\..+/,""),
        updatedAt:new Date().toISOString().replace(/T/,'').replace(/\..+/,"")
      
      }
      datas.push(obj)
    }

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
