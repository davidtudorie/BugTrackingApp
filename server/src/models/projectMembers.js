module.exports = (sequelize, DataTypes) => {
    const ProjectMembers = sequelize.define('ProjectMembers', {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'MP',
        },
    });

    return ProjectMembers;
};