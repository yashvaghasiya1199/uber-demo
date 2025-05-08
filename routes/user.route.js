const express = require("express")
const { signUp, logIn, userProfileUpdate, addRide } = require("../controllers/user.controller")
const route = express.Router()

route.post("/signup", signUp)

route.post("/login" , logIn)

route.post("/ride" , addRide)

route.put("/updateprofile" , userProfileUpdate)


module.exports = route