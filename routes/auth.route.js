const express = require("express")
const { signUp, logIn, driverSignup, driverLogin, sendOtp, changePassword, driverSendOtp, driverChangePassword } = require("../controllers/auth.controller")

const route = express.Router()

route.post("/user/signup" , signUp)

route.post("/user/login" ,logIn)

route.put("/user/forgot-password" , sendOtp )

route.put("/user/change-password" , changePassword)

route.post("/driver/signup" , driverSignup )

route.post("/driver/login" , driverLogin )

route.put("/driver/forgot-password" , driverSendOtp)

route.put("/driver/update-password" , driverChangePassword)

module.exports = route