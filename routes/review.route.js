const express = require("express")
const { postReview, deleteReview } = require("../controllers/review.controller")

const route = express.Router()

route.post("/postreview" , postReview)

route.delete("/delete/:id" , deleteReview)


module.exports = route