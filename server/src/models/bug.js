module.exports = (sequelize, DataTypes) => {
    const Bug = sequelize.define('Bug', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        severity: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        commitLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Open', 'In Progress', 'Resolved'),
            defaultValue: 'Open',
        },
    });

    return Bug;
};