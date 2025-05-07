
const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  profile_image: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'drivers',
  timestamps: true,
});


Driver.hasMany(require('./vehicle'), { foreignKey: 'driver_id' });
Driver.hasMany(require("./driverlocation") , {foreignKey: 'driverid'})

module.exports = Driver;
