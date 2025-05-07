const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    driver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'drivers', // Table name of the referenced model
        key: 'id', // The field in the referenced model (users table)
      },
    },
    type: {
      type: DataTypes.ENUM('car', 'bike'),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false, 
    },
    registration_number: {
      type: DataTypes.STRING(50),
      allowNull: false, 
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'vehicles',
    timestamps: true, 
  });

module.exports = Vehicle
