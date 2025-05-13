const payments = require("../models/payment.model");
const rides = require("../models/ride.model");
const { DatabaseError } = require("sequelize");

async function payPayment(req, res) {
  const rideId = req.params.rideid;
  
  const { method } = req.body;

  try {
    const ride = await rides.findOne({ where: { ride_id: rideId } });


    if (!ride) {
      return res.status(404).json({ msg: "Ride not found" });
    }

    console.log(ride);
    
    const { user_id, driver_id, fare_amount } = ride.dataValues;

    const create = await payments.create({
      ride_id: rideId,
      user_id: user_id,            
      driver_id: driver_id,
      fare_amount: fare_amount,        
      method: method,
      transaction_id: null
    });

    return res.status(200).json({ msg: "Payment successful", payment: create });

  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(400).json({
        msg: "Database error",
        error: error.original?.message || "Unknown database error"
      });
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

module.exports = {
  payPayment
};
