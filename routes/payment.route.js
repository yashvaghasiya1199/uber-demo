const express = require("express")
const { payPayment, cancelPayment } = require("../controllers/payment.controller")
const route = express()

route.post("/pay/:rideid" , payPayment )

route.put("/cancel/:paymentid" , cancelPayment)

module.exports = route