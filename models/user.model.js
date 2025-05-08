  
     const { DataTypes } = require('sequelize');
     const sequelize = require('../config/db');
     
     const Users = sequelize.define('User', {
       id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4, // Generates UUID automatically
         primaryKey: true,
         allowNull: false,
       },
       first_name: {
         type: DataTypes.STRING(100),
         allowNull: false,
       },
       last_name: {
         type: DataTypes.STRING(100),
         allowNull: false,
       },
       username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
       email: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
       },
       password: {
         type: DataTypes.TEXT,
         allowNull: false,
       },
       phone: {
         type: DataTypes.STRING(20),
         allowNull: true,
       },
       deleted_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
       },
     }, {
       tableName: 'users',
       timestamps: true, 
     });
     
     module.exports = Users;

