const express = require("express")
const { addVehicle, updateVehicle } = require("../controlers/vehicle")
const route = express()

route.post("/addvehicle" , addVehicle)

route.put("/updatevehicle/:vehicleid" , updateVehicle )

module.exports = route


