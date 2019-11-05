'use strict';
module.exports = (sequelize, DataTypes) => {
    const QBoard = sequelize.define('TBoard', {
        no: DataTypes.INTEGER,
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        writer: DataTypes.STRING,
        date: DataTypes.DATE
    }, {});

    return QBoard;
}; 

// 20191105