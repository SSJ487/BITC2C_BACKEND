'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Charts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }, 
      type: {
        type: Sequelize.STRING
      },
      begin: {
        type: Sequelize.STRING
      },
      end: {
        type: Sequelize.STRING
      },
      low: {
        type: Sequelize.STRING
      },
      high: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }, {
      timestamp: true, 
      underscored: true // foreignKey 에 CamelCase 대신 snake_case 를 사용하려면 underscored 를 true 로 지정한다.
    });

e
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Charts');
  }
};
