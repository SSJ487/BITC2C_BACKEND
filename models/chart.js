'use strict';
module.exports = (sequelize, DataTypes) => {
    const Chart = sequelize.define('Chart', {
        type: DataTypes.STRING,
        begin: DataTypes.STRING,
        end: DataTypes.STRING,
        low: DataTypes.STRING,
        high: DataTypes.STRING,
        date: DataTypes.STRING
    }, { timestamp: true });
  
    return Chart;
};