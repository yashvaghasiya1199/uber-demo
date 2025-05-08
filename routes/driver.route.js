const express = require("express")
const { driverSignup, driverLogin, driverProfilUpdate, driverLocations, getDriverAllLocation, driverupdateProfileImage } = require("../controllers/driver.controller")
const { driverAuth } = require("../middelweres/driverauth")
const route = express.Router()


route.post("/signup" , driverSignup)

route.post("/login" , driverLogin)

route.put("/profileupdate" , driverAuth , driverProfilUpdate)

route.put("/updateprofileimage" , driverAuth ,  driverupdateProfileImage)

route.post("/addlocation" , driverAuth , driverLocations )

//  all location of one driver
route.get("/alllocation" , getDriverAllLocation )

module.exports = route