const express = require("express")
const {    driverLocations, getDriverAllLocation, driverDocument, updateDriverDocument, driverAllInformation, AllDriverReviews, driverProfilUpdate, driverUpdateProfileImage } = require("../controllers/driver.controller")
const { driverAuth } = require("../middelweres/driverauth")
const route = express.Router()

route.put("/profile" ,driverProfilUpdate)

route.put("/profile-image" , driverUpdateProfileImage)

route.post("/addlocation"  , driverLocations )

route.post("/documents" ,driverDocument )

route.put("/updatedocument"  , updateDriverDocument)

route.get("/driverinfo/:id" , driverAllInformation )

//  all location of one driver
route.get("/driver-locations"  ,getDriverAllLocation )

route.get("/reviews" , AllDriverReviews)


module.exports = route