const ride = require('../models/ride.model');
const Users = require('../models/user.model');
const payments = require("../models/payment.model")
const reviews = require("../models/review.model")
const { userIdFromRequest } = require('../services/user.services');
const { Model } = require('sequelize');
const { errorMonitor } = require('nodemailer/lib/xoauth2');


async function userProfileUpdate(req, res) {
    try {


        const userId = userIdFromRequest(req, res)
        console.log(userId);

        const { first_name, last_name, email, phone } = req.body;

        if (!first_name && !last_name && !email && !phone) {
            return res.status(400).json({ msg: "No fields to update. Please provide at least one field to update.", error: true });
        }

        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User not found.", error: true });
        }
        if (user.email === email) {
            return res.json({ msg: "privious email id found must enter new email id", error: true })
        }

        const updatedUser = await user.update({
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            email: email || user.email,
            phone: phone || user.phone,
            updated_at: new Date(),
        });

        return res.status(200).json({
            msg: "User profile updated successfully.",
            user: {
                id: updatedUser.id,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                username: updatedUser.username,
                updated_at: updatedUser.updated_at,
            }, error: false
        });
    } catch (error) {
        console.error("User profile update error:", error);
        return res.status(500).json({ msg: error.message,error:true });
    }
}


async function allPayment(req, res) {

    const userId = userIdFromRequest(req, res)

    const allPaymentofUser = await payments.findAll({ where: { user_id: userId } });

    return res.json({ allPaymentofUser, error: false })

}



async function UserallInformation(req, res) {

    const userId = userIdFromRequest(req, res)
    try {
        const userDetails = await Users.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: ride,
                    attributes: ['ride_id', 'status', 'fare_amount', 'booked_at', 'completed_at'],
                },
                {
                    model: payments,
                    attributes: ['payment_id', 'fare_amount', 'method', 'paid_at'],
                },
                {
                    model: reviews,
                    attributes: ['review_id', 'rating', 'deleted_at'],
                }
            ]
        });

        if (!userDetails) {
           return res.json({msg:"no details found" , error:true})
        }

        return res.json({ userDetails ,error:false});
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.json({msg:error,error:true})
    }
}


module.exports = {
    userProfileUpdate,
    allPayment,
    UserallInformation
};
