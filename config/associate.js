const Driver = require('../model/driver');
const Vehicle = require('../model/vehicle');

// One-to-Many Relationship
Driver.hasMany(Vehicle, {
  foreignKey: 'driver_id',   // Vehicle મોડલમાં foreign key
  as: 'vehicles'             // alias name (optional)
});

Vehicle.belongsTo(Driver, {
  foreignKey: 'driver_id',
  as: 'driver'
});

module.exports = {
  Driver,
  Vehicle
};
