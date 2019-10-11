'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING, 
      unique: true,
      allowNull: false
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    point: DataTypes.INTEGER,
    emailcheck: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wallet);
  };
  return User;
};