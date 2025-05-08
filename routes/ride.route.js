const express = require("express")
const { createRide } = require("../controllers/ride")
const route = express.Router()

route.post("/create" , createRide)


module.exports = route