const express = require("express")
const { signUp, logIn, userProfileUpdate, allPayment } = require("../controllers/user.controller")
const route = express.Router()

route.post("/signup", signUp)

route.post("/login" , logIn)

route.put("/updateprofile" , userProfileUpdate)

route.get("/allpayment" ,allPayment )


module.exports = route