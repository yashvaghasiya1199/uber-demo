const express = require("express")
const { createRide } = require("../controllers/ride.controller")
const route = express.Router()

route.post("/create" , createRide)


module.exports = route