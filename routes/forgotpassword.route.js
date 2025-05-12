const express = require("express")

const { sendOtp, changePass, driverSendOtp, driverChangePass } = require("../controllers/forgotpassword.controller");
const route = express.Router()

route.put("/user" , sendOtp )

route.put("/user/changepass" ,changePass)

route.put("/driver" ,driverSendOtp)

route.put("/driver/changepass" , driverChangePass)


module.exports = route