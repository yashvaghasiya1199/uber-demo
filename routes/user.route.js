const express = require("express")
const {   allPayment, userProfileUpdate, UserallInformation } = require("../controllers/user.controller")
const route = express.Router()

route.put("/profile" , userProfileUpdate)

route.get("/allpayment" ,allPayment )

route.get("/me" , UserallInformation)

module.exports = route