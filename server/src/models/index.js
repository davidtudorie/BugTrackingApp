const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const User = require('./user')(sequelize, DataTypes);
const Project = require('./project')(sequelize, DataTypes);
const Bug = require('./bug')(sequelize, DataTypes);

Project.hasMany(Bug, { foreignKey: 'projectId' });

Project.belongsToMany(User, { through: 'ProjectMembers', as: 'Members' });
User.belongsToMany(Project, { through: 'ProjectMembers', as: 'Projects' });

Bug.belongsTo(Project, { foreignKey: 'projectId' });

Bug.belongsTo(User, { foreignKey: 'assignedTo', as: 'AssignedDeveloper' });




module.exports = {
    sequelize,
    User,
    Project,
    Bug,
};