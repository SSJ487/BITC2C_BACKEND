'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    type: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
      unique: true
    },
    amount: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, { timestamp: false});
  Wallet.associate = function (models) {
    Wallet.belongsTo(models.User, {
      foreignKey: "UserId"
    });
  };
  return Wallet;
};