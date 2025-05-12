const express = require("express")
const { driverSignup, driverLogin, driverProfilUpdate, driverLocations, getDriverAllLocation, driverupdateProfileImage, driverDocument, updateDriverDocument, driverAllInformation, AllDriverReviews } = require("../controllers/driver.controller")
const { driverAuth } = require("../middelweres/driverauth")
const route = express.Router()


route.post("/signup" , driverSignup)

route.post("/login" , driverLogin)

route.put("/profileupdate" , driverAuth , driverProfilUpdate)

route.put("/updateprofileimage" , driverAuth ,  driverupdateProfileImage)

route.post("/addlocation" , driverAuth , driverLocations )

route.post("/adddocument" , driverDocument )

route.put("/updatedocument" , updateDriverDocument)

route.get("/driverinfo/:driverId" , driverAllInformation )

//  all location of one driver
route.get("/alllocation" ,driverAuth ,getDriverAllLocation )

route.get("/allreview" , AllDriverReviews)


module.exports = route