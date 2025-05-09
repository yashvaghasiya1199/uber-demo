const jwt = require("jsonwebtoken")
const { TIME, DataTypes } = require("sequelize")
const { Op, literal } = require("sequelize");
const Rides = require("../models/ride.model")
const Driver = require("../models/driver.model");
const Vehicle = require("../models/vehicle.model");
const User = require("../models/user.model");
const driverLocation = require("../models/driverlocation.model")


async function createRide(req, res) {
  let { driver_id, vehicle_id, pickup_latitude, pickup_longitude, drop_latitude, drop_longitude, status } = req.body

  const userToken = req.user

  const debugToken = jwt.verify(userToken, process.env.JWT_SECRET)

  const userId = debugToken.userid

  let rideCreate;

  try {
    rideCreate = await Rides.create({
      user_id: userId,
      driver_id: driver_id,
      vehicle_id: vehicle_id,
      pickup_latitude: pickup_latitude,
      pickup_longitude: pickup_longitude,
      drop_latitude: drop_latitude,
      drop_longitude: drop_longitude,
      status: status,
      booked_at: new Date(),
      completed_at: null
    });
    // console.log("Ride created successfully:", rideCreate);
  } catch (error) {
    console.error("Error creating ride:", error);
  }

  return res.json({ msg: "ride created successfull", rideCreate })
}




async function findRide(req, res) {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ msg: "Latitude and longitude are required" });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    // find driver arrive in 10 km 

    const rawDistance = `
      6371 * acos(
        cos(radians(${userLat}::double precision)) *
        cos(radians(driverlocation.latitude::double precision)) *
        cos(radians(driverlocation.longitude::double precision) - radians(${userLng}::double precision)) +
        sin(radians(${userLat}::double precision)) *
        sin(radians(driverlocation.latitude::double precision))
      )
    `;

    const nearbyDrivers = await driverLocation.findAll({
      attributes: {
        include: [
          [literal(`CONCAT(ROUND(${rawDistance}::numeric, 2), ' km')`), 'distance']
        ]
      },
      where: literal(`(${rawDistance}) <= 10 AND driverlocation.deleted_at IS NULL`),
      include: [
        {
          model: Driver,
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image'],
          include: [
            {
              model: Vehicle,
              attributes: ['type', 'model', 'registration_number', 'color'],
              where: { deleted_at: null },
              required: false
            }
          ],
          where: { deleted_at: null }
        }
      ]
    });

    return res.json({ msg: "Available drivers within 10 km", drivers: nearbyDrivers });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error", error });
  }
}

// user allrides

driverLocation.belongsTo(Driver, { foreignKey: 'driverid' });
Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

Driver.hasMany(Vehicle, { foreignKey: 'driver_id' });

Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

Rides.belongsTo(User, { foreignKey: 'user_id' });

Rides.belongsTo(Driver, { foreignKey: 'driver_id' });

Rides.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

const userallRide = async (req, res) => {
  try {
    const userToken = req.user

    const debugToken = jwt.verify(userToken, process.env.JWT_SECRET)

    const userId = debugToken.userid

    const rides = await Rides.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: Driver,
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image'],
          include: [
            {
              model: Vehicle,
              attributes: ['type', 'model', 'registration_number', 'color'],
              where: { deleted_at: null },
              required: false
            }
          ]
        },
        {
          model: Vehicle,
          attributes: ['id', 'type', 'model', 'registration_number', 'color']
        }
      ]
    });

    res.status(200).json({ msg: "Rides fetched successfully", rides });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error });
  }
};

async function deleteRide(req,res){

  const rideid = req.params.rideid

  if(!rideid){
    return res.json({msg:"please provide rideid"})
  }

  const findRideId = await Rides.findOne({where:{ride_id:rideid}})

  if(!findRideId){
    return res.json({msg:"ride id not found"})
  }
   await findRideId.destroy()  

   return res.json({msg:"ride is deleted"})

}



module.exports = {
  createRide,
  findRide,
  userallRide,
  deleteRide 
}
