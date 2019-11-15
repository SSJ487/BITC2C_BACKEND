'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
        unique: true
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
    return queryInterface.dropTable('Wallets');
  }
};