const express = require("express")
const { driverSignup, driverLogin, driverProfilUpdate, driverLocations } = require("../controlers/driver")
const { driverauth } = require("../middelweres/driverauth")
const route = express.Router()

const Driver = require("../models/driver")
const Vehicle = require("../models/vehicle")

route.post("/signup" , driverSignup)

route.post("/login" , driverLogin)

route.put("/profileupdate" , driverauth , driverProfilUpdate)

route.post("/addlocation" , driverauth , driverLocations )


//  route under testing
route.get("/f" , async (req,res)=>{
    await Driver.findAll({
        include: {
          model: Vehicle,
          as: 'vehicles'
        }
      }).then(drivers => {
        console.log(JSON.stringify(drivers, null, 2));
      });
})
module.exports = route