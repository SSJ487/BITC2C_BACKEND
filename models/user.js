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
    emailcheck: DataTypes.INTEGER
  }, { timestamp: true});
  User.associate = function(models) {
    User.hasMany(models.Wallet);
    User.hasMany(models.Alarm);
  };
  return User;
};

