const jwt = require("jsonwebtoken")
const Review = require("../models/review.model");
const Ride = require("../models/ride.model");
const validator = require("validator");
const { userIdFromRequest } = require("../services/user.services");
 
async function postReview (req, res)  {
  try {

    const userId = userIdFromRequest(req,res); 

    const { ride_id, rating } = req.body;

    const uuidValidation = validator.isUUID(ride_id)

    if(!uuidValidation){
      return res.json({msg:"invalid uuid enter",error:true})
    }

    const ride = await Ride.findOne({ where: { ride_id:ride_id } });
    

    if (!ride) {
      return res.status(404).json({ message: "Ride not found",error:true });
    }

    //  checking only ridebook user can give review (other user cannot reviews)
    if (ride.user_id !== userId) {
      return res.status(403).json({ message: "You are not allowed to review this ride",error:true });
    }

    // user can comment only one time
    const existingReview = await Review.findOne({
      where: {
        ride_id,
        user_id: userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this ride",error:true });
    }

    // Create the review
    const review = await Review.create({
      ride_id,
      user_id: userId,
      driver_id: ride.driver_id, 
      rating
    });

    res.status(201).json({review,error:false});

  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error",error:true});
  }
};

async function deleteReview(req,res){

  const reviewId = req.params.reviewid

  const userId = userIdFromRequest(req,res); 


  if(!reviewId){
    return res.json({msg:"please provide review id",error:true})
  }

  const findReview = await Review.findOne({where:{id:reviewId}})

  // only that user delete review who create
  if (findReview.user_id !== userId) {
    return res.status(403).json({ message: "You are not allowed to review this ride" ,error:true});
  }


  if(!findReview){
    return res.josn({msg:"review can't find",error:true})
  }

  await findReview.destroy()

  return res.json({msg:"review delete success",error:false})
}

module.exports = {
    postReview,
    deleteReview
}