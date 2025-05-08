const Rides = require("../models/ride.model")


async function createRide(){
     let {pickup_latitude , pickup_longitude , drop_latitude ,drop_longitude ,status ,booked_at,  completed_at } = req.body
      let rideCreate = Rides.create({
        pickup_latitude ,
        pickup_longitude,
        drop_latitude,
        
      }) 

}

module.exports = { 
    createRide
}