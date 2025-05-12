const express = require("express")
const { payPayment } = require("../controllers/payment.controller")
const route = express()

route.post("/pay/:rideid" , payPayment )

module.exports = route