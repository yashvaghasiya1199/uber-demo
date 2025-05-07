const express = require("express")
const { addVehicle, updateVehicle, getDriverAllVehicles } = require("../controlers/vehicle")
const route = express()
const Driver = require("../models/driver")
const Vehicle = require("../models/vehicle")
const { driverauth } = require("../middelweres/driverauth")

route.post("/addvehicle" , addVehicle)

route.put("/updatevehicle/:vehicleid" , updateVehicle )

//  all vehicle of driver
route.get("/alldata" , driverauth , getDriverAllVehicles)

module.exports = route


