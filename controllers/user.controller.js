const Users = require('../models/user.model');
const payments = require("../models/payment.model")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { findUserByEmailorUsername } = require("../services/user.services");
const { jwtTokenCreate } = require('../utills/jwtToken.utill');

async function signUp(req, res) {
    try {

        const { first_name, last_name, email, password, phone, username } = req.body;

        // Validate input
        if (!first_name || !last_name || !email || !password || !phone || !username) {
            return res.status(400).json({ msg: "All required fields must be provided." });
        }

        const existingUser = await findUserByEmailorUsername(email);

        if (existingUser) {
            return res.status(409).json({ msg: "User already exists. Please change email or username." });
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Users.create({
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword, 
            phone,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
        });

        return res.status(201).json({
            msg: "User signed up successfully.",
            user: newUser // Send the user data without the password
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
}

async function  logIn(req, res) {
    const { emailorusername, password } = req.body;

    try {
        // Find user by email or username
        const user = await findUserByEmailorUsername(emailorusername);

        if (!user) {
            return res.json({ err: "Invalid email or username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ msg: "Invalid password" });
        }

        const payload = { userid: user.id };

        // Generate token 
        const token = jwtTokenCreate(payload);

        //cookie set
        res.cookie("usertoken", token);

        return res.json({ msg: "Login successful", token, user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
}

async function userProfileUpdate(req, res) {
    try {
     const userToken = req.cookies?.usertoken
     
     const tokenVerify = jwt.verify(userToken , process.env.JWT_SECRET)
     
     const userId = tokenVerify.userid
     console.log(userId);

        const { first_name, last_name, email, phone } = req.body;

        if (!first_name && !last_name && !email && !phone ) {
            return res.status(400).json({ msg: "No fields to update. Please provide at least one field to update." });
        }

        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }
        if(user.email === email){
            return res.json({msg:"privious email id found must enter new email id"})
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
            }
        });
    } catch (error) {
        console.error("User profile update error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
}

async function allPayment(req,res){

    const userToken = req.cookies?.usertoken
     
    const tokenVerify = jwt.verify(userToken , process.env.JWT_SECRET)
    
    const userId = tokenVerify.userid

    const allPaymentofUser = await payments.findAll({ where: { user_id: userId } });

    return res.json({allPaymentofUser})

}

module.exports = {
    signUp,
    logIn,
    userProfileUpdate,
    allPayment
};
