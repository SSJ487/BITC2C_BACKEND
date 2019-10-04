'use strict';
module.exports = (sequelize, DataTypes) => {
  const tradeboard = sequelize.define('tradeboard', {
    user_target: DataTypes.STRING,
    type: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    method: DataTypes.STRING,
    status: DataTypes.INTEGER,
    SellerId : DataTypes.STRING,
    BuyerId : DataTypes.STRING
  }, {});
  
  return tradeboard;
};