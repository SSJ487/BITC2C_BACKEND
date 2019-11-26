'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    type: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
      unique: true
    },
    UserId: DataTypes.INTEGER
  }, { timestamp: true });
  Wallet.associate = function (models) {
    Wallet.belongsTo(models.User, {
      foreignKey: "UserId",
      targetKey: 'id'
    });
  };
  return Wallet;
};