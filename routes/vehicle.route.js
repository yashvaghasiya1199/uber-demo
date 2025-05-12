const express = require("express")
const { addVehicle, updateVehicle, getDriverAllVehicles, findSingleVahicle, deleteVehicle } = require("../controllers/vehicle.controller")
const route = express()
const { driverAuth } = require("../middelweres/driverauth")

route.post("/addvehicle" , addVehicle)

route.put("/updatevehicle/:vehicleid" , updateVehicle )

route.delete("/delete/:vehicleid" , deleteVehicle)

//  all vehicle of driver
route.get("/alldata" , driverAuth , getDriverAllVehicles)

route.get("/singlevahicle/:vehicleid" , findSingleVahicle )

module.exports = route


