'use strict';
module.exports = (sequelize, DataTypes) => {
    const Alarm = sequelize.define('Alarm', {
        status: DataTypes.STRING,
        socketId: DataTypes.STRING,
        UserId: DataTypes.INTEGER,
        tableId: DataTypes.INTEGER
    }, { timestamp: true });
    Alarm.associate = function (models) {
        Alarm.belongsTo(models.User, {
            foreignKey: "UserId",
            targetKey: 'id'
        });
        // Alarm.belongsTo(models.TBoard, {
        //     foreignKey: "tableId",
        //     targetKey: 'id'
        // });
    };
    return Alarm;
};