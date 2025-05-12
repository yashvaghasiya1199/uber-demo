
const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");
const Vehicle = require('./vehicle.model');
const DriverDocument = require('./driverdocument.model');
const DriverLocation = require('./driverlocation.model');

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
    defaultValue: 'https://res.cloudinary.com/dkfhw2v5x/image/upload/v1746678762/default-profile_en2vne.jpg'
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

Driver.hasMany(Vehicle, { foreignKey: 'driver_id'   });
Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

//  for driver's all information
Driver.hasOne(require('./driverdocument.model'), { 
  foreignKey: 'driver_id', 
  as: 'driverdocument'  // Make sure this alias matches in the query below
});

Driver.hasMany(require('./vehicle.model'), { 
  foreignKey: 'driver_id', 
  as: 'vehicles' // Make sure this alias matches in the query below
});
DriverDocument.belongsTo(Driver, { 
  foreignKey: 'driver_id', 
  as: 'driver' // This can be optional if you don't need to use it in queries
});
Vehicle.belongsTo(Driver, { 
  foreignKey: 'driver_id', 
  as: 'driver' // This can be optional if you don't need to use it in queries
});





module.exports = Driver;
