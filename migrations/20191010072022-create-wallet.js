'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Wallets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      address: {
        type: Sequelize.STRING,
        unique: true
      },
      amount: Sequelize.INTEGER
    }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          Wallets.belongsTo(models.Users, {
            foreignKey: 'id'
          });
        }
      }
    }, {
      timestamp: false, // timestamp 를 사용한다.
      underscored: true // foreignKey 에 CamelCase 대신 snake_case 를 사용하려면 underscored 를 true 로 지정한다.
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Wallets');
  }
};