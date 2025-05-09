const express = require("express")
const { createRide, findRide, userallRide, deleteRide } = require("../controllers/ride.controller")
const route = express.Router()

route.post("/create" , createRide)

//  find other driver who readius in 10 km accorrding to user latitude and longitude
route.get("/findride" , findRide )

route.delete("/deleteride/:rideid" , deleteRide )

route.get("/userallride" , userallRide)


module.exports = route