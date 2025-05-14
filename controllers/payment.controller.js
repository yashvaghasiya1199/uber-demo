const payments = require("../models/payment.model");
const rides = require("../models/ride.model");
const { DatabaseError } = require("sequelize");
const { userIdFromRequest } = require("../services/user.services");


async function payPayment(req, res) {
  const rideId = req.params.rideid;
  const userId = userIdFromRequest(req, res);
  const { method } = req.body;

  try {
    const ride = await rides.findOne({ where: { ride_id: rideId } });

    if (!ride) {
      return res.status(404).json({ msg: "Ride not found" ,error:true});
    }

    // only booked user can payment
    if (ride.user_id !== userId) {
      return res.status(403).json({ msg: "You are not authorized to make this payment" ,error:true});
    }

    const existingPayment = await payments.findOne({
      where: {
        ride_id: rideId,
        cancel_at: null, 
      }
    });

    // user can not pay multiple time
    if (existingPayment && existingPayment.cancel_at === null) {
      return res.status(400).json({ msg: "Payment already exists and has not been cancelled",error:true });
    }

    const { user_id, driver_id, fare_amount } = ride.dataValues;

    const create = await payments.create({
      ride_id: rideId,
      user_id: user_id,
      driver_id: driver_id,
      fare_amount: fare_amount,
      method: method,
      transaction_id: null, 
    });

    return res.status(200).json({ msg: "Payment successful", payment: create ,error:false});

  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(400).json({
        msg: "Database error",
        error: error.original?.message || "Unknown database error",
        error:true
      });
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({ msg: "Internal server error",error:true });
  }
}


async function cancelPayment(req,res){
  const paymentId = req.params.paymentid

  const userId = userIdFromRequest(req,res)
  const findPayment = await payments.findOne({where:{payment_id:paymentId}})

  if(!findPayment){
    return res.json({msg:"please enter valid paymentis",error:true})
  }
  if(findPayment.user_id !== userId){
    return res.json({msg:"you are not authorised ",error:true})
  }
  let cancelPayment = await findPayment.update(
    { cancel_at: new Date() },
    { where: { payment_id: findPayment.payment_id } }
  );
return  res.json({msg:"payment cancel successfully",error:false})

}

module.exports = {
  payPayment,
  cancelPayment
};
