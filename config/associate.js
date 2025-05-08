const Driver = require('../model/driver');
const Vehicle = require('../model/vehicle');

Driver.hasMany(Vehicle, {
  foreignKey: 'driver_id',
  as: 'vehicles'          
});

Vehicle.belongsTo(Driver, {
  foreignKey: 'driver_id',
  as: 'driver'
});

module.exports = {
  Driver,
  Vehicle
};
