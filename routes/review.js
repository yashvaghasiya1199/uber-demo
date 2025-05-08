const express = require("express")
const { postReview } = require("../controllers/review.controller")

const route = express.Router()

route.post("/postreview" , postReview)


module.exports = route