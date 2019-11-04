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
      contractwallet: {
        type: Sequelize.STRING
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
      
    });
    
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TBoards');
  }
};