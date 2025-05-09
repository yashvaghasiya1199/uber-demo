const Driver = require('../model/driver');
const Vehicle = require('../model/vehicle');
const Rides = require("../models/ride.model")
const User = require("../models/user.model")

Driver.hasMany(Vehicle, {
  foreignKey: 'driver_id',
  as: 'vehicles',
});

Vehicle.belongsTo(Driver, {
  foreignKey: 'driver_id',
  as: 'driver',
});

//  find ride 
Driver.hasMany(Vehicle, { foreignKey: 'driver_id' });

Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

driverLocation.belongsTo(Driver, { foreignKey: 'driverid' });

// driver and vehicle under testing
// ----------------------------------------------------------------------------

// driverlocation.belongsTo(Driver, { foreignKey: 'driverid' });
// Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

// Driver.hasMany(Vehicle, { foreignKey: 'driver_id' });

// Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

// Rides.belongsTo(User, { foreignKey: 'user_id' });

// Rides.belongsTo(Driver, { foreignKey: 'driver_id' });

// Rides.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

module.exports = {
  Driver,
  Vehicle
};
