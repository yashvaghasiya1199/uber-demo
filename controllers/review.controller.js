const jwt = require("jsonwebtoken")
const Review = require("../models/review.model");
const Ride = require("../models/ride.model");
 
async function postReview (req, res)  {
  try {
    const userToken = req.user

    const tokenVerify  = jwt.verify(userToken,process.env.JWT_SECRET)

    const userId = tokenVerify.userid; 

    const { ride_id, rating } = req.body;


    const ride = await Ride.findOne({ where: { ride_id:ride_id } });
    console.log(ride_id);
    

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    //  checking only ridebook user can give review (other user cannot reviews)
    if (ride.user_id !== userId) {
      return res.status(403).json({ message: "You are not allowed to review this ride" });
    }

    // user can comment only one time
    const existingReview = await Review.findOne({
      where: {
        ride_id,
        user_id: userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this ride" });
    }

    // Create the review
    const review = await Review.create({
      ride_id,
      user_id: userId,
      driver_id: ride.driver_id, 
      rating
    });

    res.status(201).json(review);

  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
    postReview
}