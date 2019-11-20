'use strict';

var add_minutes =  function (dt, minutes) {
  return new Date(dt.getTime() + minutes*60000);
}

function change(date1,date){
  let temp =0;


  return
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    let datas =[]
    let methodname;

    const coindata = ["Atoken","Btoken","Ctoken"];

    let d1 = new Date()
    for(let i =0;i<250;i++){


      let d3 =new Date(d1.getMinutes()+(60*i))


      let beginRandom = parseInt(Math.random() *(30000 -10) +10)
      let endRandom = parseInt(Math.random() *(30000 -10) +10)
      let lowRandom = parseInt(Math.random() *(30000 -10) +10)
      let highRandom = parseInt(Math.random() *(30000 -10) +10)
      const coindatarandom1=parseInt(Math.random() * (4-0)+0 )

      let temp =0;
      let temp1 =0;
      let temp2 =0;
      let temp3 = 0;
      let temp4 =0;
      if(highRandom<lowRandom){
        temp = lowRandom;
        lowRandom=highRandom;
        highRandom=temp;
      }

      if(beginRandom>highRandom){
        temp1 = beginRandom
        beginRandom=highRandom
        highRandom=temp1

      }
      if(beginRandom<lowRandom){
        temp2 = beginRandom
        beginRandom=lowRandom
        lowRandom=temp2

      }
      if(endRandom>highRandom){
        temp3 = beginRandom
        endRandom=highRandom
        highRandom=temp1

      }
      if(endRandom<lowRandom){
        temp4 = endRandom
        endRandom=lowRandom
        lowRandom=temp4

      }

    
      let obj={
        type:"Atoken",
        begin:beginRandom,
        end:endRandom,
        low:lowRandom,
        high:highRandom,
        date: add_minutes(new Date(), (60*i) ),
        createdAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),

      }
      datas.push(obj)
    }
    for(let i =0;i<250;i++){


      let d3 =new Date(d1.getMinutes()+(60*i))


      let beginRandom = parseInt(Math.random() *(30000 -20000) +20000)
      let endRandom = parseInt(Math.random() *(beginRandom -20000) +20000)
      let lowRandom = parseInt(Math.random() *(30000 -20000) +20000)
      let highRandom = parseInt(Math.random() *(lowRandom+200 -20000) +20000)


      let temp =0;
      let temp1 =0;
      let temp2 =0;
      let temp3 = 0;
      let temp4 =0;
      if(highRandom<lowRandom){
        temp = lowRandom;
        lowRandom=highRandom;
        highRandom=temp;
      }

      if(beginRandom>highRandom){
        temp1 = beginRandom
        beginRandom=highRandom
        highRandom=temp1

      }
      if(beginRandom<lowRandom){
        temp2 = beginRandom
        beginRandom=lowRandom
        lowRandom=temp2

      }
      if(endRandom>highRandom){
        temp3 = beginRandom
        endRandom=highRandom
        highRandom=temp1

      }
      if(endRandom<lowRandom){
        temp4 = endRandom
        endRandom=lowRandom
        lowRandom=temp4

      }


      let obj={
        type:"Ctoken",
        begin:beginRandom,
        end:endRandom,
        low:lowRandom,
        high:highRandom,
        date: add_minutes(new Date(), (60*i) ),
        createdAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),

      }
      datas.push(obj)
    }

    for(let i =0;i<250;i++){


      let d3 =new Date(d1.getMinutes()+(60*i))


      let beginRandom = parseInt(Math.random() *(30000 -10) +10)
      let endRandom = parseInt(Math.random() *(30000 -10) +10)
      let lowRandom = parseInt(Math.random() *(30000 -10) +10)
      let highRandom = parseInt(Math.random() *(30000 -10) +10)
      const coindatarandom1=parseInt(Math.random() * (4-0)+0 )

      let temp =0;
      let temp1 =0;
      let temp2 =0;
      let temp3 = 0;
      let temp4 =0;
      if(highRandom<lowRandom){
        temp = lowRandom;
        lowRandom=highRandom;
        highRandom=temp;
      }

      if(beginRandom>highRandom){
        temp1 = beginRandom
        beginRandom=highRandom
        highRandom=temp1

      }
      if(beginRandom<lowRandom){
        temp2 = beginRandom
        beginRandom=lowRandom
        lowRandom=temp2

      }
      if(endRandom>highRandom){
        temp3 = beginRandom
        endRandom=highRandom
        highRandom=temp1

      }
      if(endRandom<lowRandom){
        temp4 = endRandom
        endRandom=lowRandom
        lowRandom=temp4

      }


      let obj={
        type:"Btoken",
        begin:beginRandom,
        end:endRandom,
        low:lowRandom,
        high:highRandom,
        date: add_minutes(new Date(), (60*i) ),
        createdAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        updatedAt:new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),

      }
      datas.push(obj)
    }

    return queryInterface.bulkInsert('Charts',datas,{});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Charts',null,{});
  }
};
