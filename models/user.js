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
    wallet: DataTypes.STRING,
    emailcheck: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};