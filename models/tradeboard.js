'use strict';
module.exports = (sequelize, DataTypes) => {
  const TBoard = sequelize.define('TBoard', {
    selltoken: DataTypes.STRING,
    buytoken: DataTypes.STRING,
    selltokenamount: DataTypes.INTEGER,
    buytokenamount: DataTypes.INTEGER,
    contractwallet: DataTypes.STRING,
    status: DataTypes.INTEGER,
    sellerId : DataTypes.STRING,
    buyerId : DataTypes.STRING,
    Expirydate :DataTypes.DATE
  }, {});
  // TBoard.associate = function (models) {
  //   TBoard.hasMany(models.Alarm);
  // };
  return TBoard;
};