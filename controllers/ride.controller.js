const { TIME, DataTypes } = require("sequelize")
const Rides = require("../models/ride.model")
const jwt = require("jsonwebtoken")


async function createRide(req,res){
     let {driver_id ,vehicle_id ,pickup_latitude , pickup_longitude , drop_latitude ,drop_longitude ,status } = req.body

     const userToken = req.user

     const debugToken = jwt.verify(userToken , process.env.JWT_SECRET)

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
      console.log("Ride created successfully:", rideCreate);
    } catch (error) {
      console.error("Error creating ride:", error);
    }
    
  return res.json({msg:"ride created successfull" , rideCreate})
}

module.exports = { 
    createRide
}