const Driver = require('../models/driver.model');
const Vehicle = require('../models/vehicle.model');
const driverDocumentModel = require("../models/driverdocument.model")
const driverLocation = require("../models/driverlocation.model")
const Rides = require("../models/ride.model")
const User = require("../models/user.model")


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

