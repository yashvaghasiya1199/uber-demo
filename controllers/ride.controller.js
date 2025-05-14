const Rides = require("../models/ride.model")
const Driver = require("../models/driver.model");
const Vehicle = require("../models/vehicle.model");
const User = require("../models/user.model");
const driverLocation = require("../models/driverlocation.model")
const { ValidationError, DatabaseError } = require("sequelize");
const { Op, literal } = require("sequelize");
const { userIdFromRequest } = require("../services/user.services");
const { calculateDistance, distance, distanceCondition } = require("../services/ride.service");

const RATE_PER_KM = 30;
async function createRide(req, res) {
  const {
    driver_id,
    vehicle_id,
    pickup_latitude,
    pickup_longitude,
    drop_latitude,
    drop_longitude,
    status
  } = req.body;

  try {
    // Decode user ID from token
    const userId = userIdFromRequest(req, res)
    console.log(userId);
    

    // Calculate distance and fare
    const distance = calculateDistance(
      parseFloat(pickup_latitude),
      parseFloat(pickup_longitude),
      parseFloat(drop_latitude),
      parseFloat(drop_longitude)
    );

    const fare = parseFloat((distance * RATE_PER_KM).toFixed(2));

    // Create ride with fare
    const rideCreate = await Rides.create({
      user_id: userId,
      driver_id,
      vehicle_id,
      pickup_latitude,
      pickup_longitude,
      drop_latitude,
      drop_longitude,
      status,
      fare_amount: fare,
      booked_at: new Date(),
      completed_at: null
    });

    return res.json({ msg: "Ride created successfully", ride: rideCreate ,error:false});

  } catch (error) {

    if (error instanceof ValidationError) {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ msg: "Validation error", errors: messages ,error:true});
    }

    // Sequelize database (SQL/Postgres) error
    if (error instanceof DatabaseError) {
      // Return the original PG error message
      return res.status(400).json({
        msg: "Database error",
        error: error.original?.message || "Unknown database error",
        error:true
      });
    }

    console.error("Error creating ride:", error);
    return res.status(500).json({ msg: "Internal server error" ,error:true});
  }
}


const SEARCH_RADIUS_KM = 10;

async function findRide(req, res) {
  const { pickup_latitude, pickup_longitude } = req.body;

  if (!pickup_latitude || !pickup_longitude) {
    return res.status(400).json({ msg: "Pickup coordinates required", error: true });
  }

  try {
    const drivers = await driverLocation.findAll({
      where: distanceCondition(pickup_latitude,pickup_longitude),
      include: [
        {
          model: Driver,
          include: [
            {
              model: Vehicle,
              where: { deleted_at: null }
            }
          ],
          where: { deleted_at: null }
        }
      ]
    });

    return res.json({
      msg: "Nearby drivers fetched successfully",
      drivers,
      error: false
    });
  } catch (error) {
    console.error("Error fetching nearby drivers:", error);
    return res.status(500).json({ msg: "Internal server error", error: true });
  }
}


// user allrides

async function userallRide(req,res){
  const userId = userIdFromRequest(req,res)
  try {
    const rides = await Rides.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        },
        {
          model: Driver, 
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: Vehicle, 
          attributes: ['vehicle_id', 'type', 'model', 'registration_number', 'color']
        }
      ]
    });

    return res.json({rides,error:false});
    } catch (error) {
    console.error("Error fetching user rides:", error);
    return res.json({error,error:true})
  }
}

async function deleteRide(req, res) {

  const rideid = req.params.rideid

  if (!rideid) {
    return res.json({ msg: "please provide rideid" ,error:true})
  }

  const findRideId = await Rides.findOne({ where: { ride_id: rideid } })

  if (!findRideId) {
    return res.json({ msg: "ride id not found" ,error:true})
  }
  await findRideId.destroy()

  return res.json({ msg: "ride is deleted" ,error:false})

}



module.exports = {
  createRide,
  findRide,
  userallRide,
  deleteRide
}
