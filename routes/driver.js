const express = require("express")
const { driverSignup, driverLogin, driverProfilUpdate, driverLocations, getDriverAllLocation, driverupdateProfileImage } = require("../controlers/driver")
const { driverauth } = require("../middelweres/driverauth")
const route = express.Router()

const Driver = require("../models/driver")
const Vehicle = require("../models/vehicle")
const driverlocation = require("../models/driverlocation")

route.post("/signup" , driverSignup)

route.post("/login" , driverLogin)

route.put("/profileupdate" , driverauth , driverProfilUpdate)

route.put("/updateprofileimage" , driverauth ,  driverupdateProfileImage)

route.post("/addlocation" , driverauth , driverLocations )

//  all location of one driver
route.get("/alllocation" , getDriverAllLocation )
module.exports = route