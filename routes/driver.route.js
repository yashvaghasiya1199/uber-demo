const express = require("express")
const {    driverLocations, getDriverAllLocation, driverDocument, updateDriverDocument, driverAllInformation, AllDriverReviews, driverProfilUpdate, driverUpdateProfileImage } = require("../controllers/driver.controller")
const { driverAuth } = require("../middelweres/driverauth")
const route = express.Router()

route.put("/profile" ,driverProfilUpdate)

route.put("/profile-image" , driverUpdateProfileImage)

route.post("/addlocation"  , driverLocations )

route.post("/adddocument" ,driverDocument )

route.put("/updatedocument"  , updateDriverDocument)

route.get("/driverinfo/:driverId" , driverAllInformation )

//  all location of one driver
route.get("/alllocation"  ,getDriverAllLocation )

route.get("/allreview" , AllDriverReviews)


module.exports = route