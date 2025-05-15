const express = require("express")
const { createRide, findRide, userallRide, deleteRide } = require("../controllers/ride.controller")
const route = express.Router()

route.post("/create" , createRide)

//  find other driver who readius in 10 km accorrding to user latitude and longitude
route.get("/nearby-drivers" , findRide )

route.delete("/delete/:id" , deleteRide )

//user all rides
route.get("/rides" , userallRide)


module.exports = route