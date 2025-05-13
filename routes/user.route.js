const express = require("express")
const {   allPayment, userProfileUpdate } = require("../controllers/user.controller")
const route = express.Router()

route.put("/profile" , userProfileUpdate)

route.get("/allpayment" ,allPayment )


module.exports = route