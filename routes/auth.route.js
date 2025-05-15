const express = require("express")
const { signUp, logIn, driverSignup, driverLogin, sendOtp, changePassword, driverSendOtp, driverChangePassword } = require("../controllers/auth.controller")
const rateLimit = require('express-rate-limit');
const route = express.Router()
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 5, 
    message: 'Too many requests, please try again later.',
  });

route.post("/user/signup" , signUp)

route.post("/user/login" , limiter ,logIn)

route.put("/user/forgot-password" , sendOtp )

route.put("/user/change-password" , changePassword)

route.post("/driver/signup" , driverSignup )

route.post("/driver/login" , driverLogin )

route.put("/driver/forgot-password" , driverSendOtp)

route.put("/driver/change-password" , driverChangePassword)

module.exports = route