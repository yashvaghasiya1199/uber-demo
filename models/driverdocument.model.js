
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DriverDocument = sequelize.define('driverdocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  driver_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'drivers',
      key: 'id',
    },
  },
  pancard: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  aadharcard_front: {
    type: DataTypes.STRING,
    allowNull:true
  },
  aadharcard_back: {
    type: DataTypes.STRING,
    allowNull:true
  }
}, {
  tableName: 'driverdocuments',
  timestamps: true,
});
 
module.exports = DriverDocument