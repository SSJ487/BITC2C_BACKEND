'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    type: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
      unique: true
    },
    amount: DataTypes.INTEGER,
  }, { timestamp: false});
  Wallet.associate = function (models) {
    Wallet.belongsTo(models.User);
  };
  return Wallet;
};