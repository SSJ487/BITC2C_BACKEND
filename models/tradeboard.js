'use strict';
module.exports = (sequelize, DataTypes) => {
  const TBoard = sequelize.define('TBoard', {
    type: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    method: DataTypes.STRING,
    status: DataTypes.INTEGER,
    sellerId : DataTypes.STRING,
    buyerId : DataTypes.STRING
  }, {});
  
  return TBoard;
};