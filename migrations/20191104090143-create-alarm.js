'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Alarms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      socketId: {
        type: Sequelize.STRING
      },
      tableId: {
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id', }
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


  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Alarms');
  }
};