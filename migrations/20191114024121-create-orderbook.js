'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orderbooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TableId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      sellerconfirm: {
        type: Sequelize.INTEGER
      },
      buyerconfirm: {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orderbooks');
  }
};