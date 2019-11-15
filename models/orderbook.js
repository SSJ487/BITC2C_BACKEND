'use strict';
module.exports = (sequelize, DataTypes) => {
  const orderbook = sequelize.define('orderbook', {
    TableId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    sellerconfirm: DataTypes.INTEGER,
    buyerconfirm: DataTypes.INTEGER,
    selltoken: DataTypes.STRING,
    buytoken: DataTypes.STRING,
    selltokenamount: DataTypes.INTEGER,
    buytokenamount: DataTypes.INTEGER
  }, {});
  orderbook.associate = function(models) {
    // associations can be defined here
  };
  return orderbook;
};