const Driver = require('../models/driver.model');
const Vehicle = require('../models/vehicle.model');
const driverDocument = require("../models/driverdocument.model")
const driverLocation = require("../models/driverlocation.model")
const Rides = require("../models/ride.model")
const User = require("../models/user.model")
const Review = require("../models/review.model")

// driver and vehicle
Driver.hasMany(Vehicle, {
  foreignKey: 'driver_id',
  onDelete: 'CASCADE'
});
Vehicle.belongsTo(Driver, {
  foreignKey: 'driver_id'
});

// driver and document
Driver.hasOne(driverDocument, {
  foreignKey: 'driver_id',
  onDelete: 'CASCADE'
});
driverDocument.belongsTo(Driver, {
  foreignKey: 'driver_id'
});

// driver and document 
Driver.hasMany(driverLocation, {
  foreignKey: 'driver_id',
  onDelete: 'CASCADE'
});
driverLocation.belongsTo(Driver, {
  foreignKey: 'driver_id'
});

// ride and user 
Rides.belongsTo(User, {
  foreignKey: 'user_id'
});

// ride and driver
Rides.belongsTo(Driver, {
  foreignKey: 'driver_id'
});

// ride and vehicles
Rides.belongsTo(Vehicle, {
  foreignKey: 'vehicle_id'
});

// ride and reviews
Rides.hasMany(Review, {
  foreignKey: 'ride_id',
  onDelete: 'CASCADE'
});
Review.belongsTo(Rides, {
  foreignKey: 'ride_id'
});
