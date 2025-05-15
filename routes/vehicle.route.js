const express = require("express")
const { addVehicle, updateVehicle, getDriverAllVehicles, findSingleVahicle, deleteVehicle } = require("../controllers/vehicle.controller")
const route = express()

route.post("/add" , addVehicle)

route.put("/updatevehicle/:id" , updateVehicle )

route.delete("/delete/:id" , deleteVehicle)

//  all vehicle of driver
route.get("/driver-vehicles" , getDriverAllVehicles)

route.get("/singlevahicle/:id" , findSingleVahicle )

module.exports = route


