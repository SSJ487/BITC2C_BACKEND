'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('TBoards', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      selltoken: {
        type: Sequelize.STRING
      },
      buytoken: {
        type: Sequelize.STRING
      },
      selltokenamount: {
        type: Sequelize.INTEGER
      },
      buytokenamount: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      SellerId: {
        type: Sequelize.STRING
      },
      buyerId: {
        type: Sequelize.STRING
      },
      Expirydate:{
        allowNull: false,
        type: Sequelize.DATE
      }
      
    },
      {
        timestamp: false, // timestamp 를 사용한다.
        underscored: true // foreignKey 에 CamelCase 대신 snake_case 를 사용하려면 underscored 를 true 로 지정한다.
      });
    
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TBoards');
  }
};