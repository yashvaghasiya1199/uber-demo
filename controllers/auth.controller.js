const Users = require('../models/user.model');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const drivers = require("../models/driver.model")
const review = require("../models/review.model");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2
const { findUserByEmailorUsername } = require("../services/user.services");
const { jwtTokenCreate } = require('../utills/jwtToken.utill');
const { findDriverUsernameandEmail } = require("../services/driver.services");
const { emailService } = require('../services/email.service');


// USER AUTH
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function signUp(req, res) {
    try {

        const { first_name, last_name, email, password, phone, username } = req.body;

        // Validate input
        if (!first_name || !last_name || !email || !password || !phone || !username) {
            return res.status(400).json({ msg: "All required fields must be provided." ,error:true });
        }

        const existingUser = await findUserByEmailorUsername(email);

        if (existingUser) {
            return res.status(409).json({ msg: "User already exists. Please change email or username." ,error:true});
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
            user: newUser ,
            error:false
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message,error:true });
    }
}

async function logIn(req, res) {
    const { emailorusername, password } = req.body;

    try {
        // Find user by email or username
        const user = await findUserByEmailorUsername(emailorusername);

        if (!user) {
            return res.json({ err: "Invalid email or username" ,error:true });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ msg: "Invalid password" ,error:true});
        }

        const payload = { userid: user.user_id };

        // Generate token 
        const token = jwtTokenCreate(payload);

        //cookie set
        res.cookie("usertoken", token);

        return res.json({ msg: "Login successful",error:false, user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Server error", error: error.message ,error:true});
    }
}


// forgot password 

async function sendOtp(req, res) {

    const otp = Math.floor(Math.random() * 10000 + 10000)

    const { email, duplicate } = req.body
    if (!email) {
        return res.json({ msg: "please enter email" ,error:true})
    }

    const findUser = await Users.findOne({ where: { email: duplicate } })
    if (!findUser) {
        return res.json({ msg: "please enter valid email",error:true})
    }

    let updated = await Users.update(
        { otp: otp },
        { where: { email: duplicate } }
    );

    let num = Math.floor(Math.random() * 10000 + 10000)
    console.log(num);

    const sendOtp =  emailService(email,otp)
    

    return res.json({ msg: "done" ,error:false})
}

//   update password 
async function changePassword(req, res) {
    const { otp, newpassword } = req.body

    const otpFind = await Users.findOne({ where: { otp: otp } })

    if (!otpFind) {
        return res.json({ msg: "invalid otp" ,error:true})
    }
    const hasPsssword = await bcrypt.hash(newpassword, 10)
    const update = await Users.update(
        { password: hasPsssword },
        { where: { otp: otp } }
    )
    return res.json({ msg: "password update successfully", update ,error:false})
}


// DRIVER AUTH
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// for uploaddin profile image setup
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});



async function driverSignup(req, res) {

    const { first_name, last_name, email, username, password, phone, } = req.body;

    if (!first_name || !last_name || !email || !password || !phone || !username) {
        return res.status(400).json({ msg: "All required fields must be provided." ,error:true});
    }

    const file = req.files.profileimage
    console.log(file);

    const FindUserName = await drivers.findOne({ where: { username: username } })

    if (FindUserName) {
        return res.json({ msg: "username already exists" ,error:true})
    }

    // if file > 1 mb then user can't upload image

    const maxSize = 1 * 1024 * 1024;

    if (file.size > maxSize) {
        return res.status(400).json({msg:"Your image is too large. Max allowed size is 1MB.",error:true});
    }

    if (!req.files || !req.files.profileimage) {
        return res.status(400).json({ msg: "Profile image is required." ,error:true});
    }

    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
        console.log(uploadResult);

    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ msg: "Username or email already exists.",error:true });
        }
        consol
        return res.status(500).json({ msg: "Image upload failed.",error:true });
    }

    const existingDriver = await findDriverUsernameandEmail(email);
    if (existingDriver) {
        return res.json({ msg: "Email or username already exists.",error:true });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    let create = await drivers.create({
        first_name,
        last_name,
        email,
        password: hashedPassword, 
        phone,
        username,
        deleted_at: null,
        profile_image: uploadResult.url,
    });

    return res.json({ msg: "Driver signup success", create ,error:false});
}


async function driverLogin(req, res) {
    const { emailorusername, password } = req.body;
    if (!emailorusername || !password) {
        return res.json({ msg: "Please enter both fields",error:true});
    }

    let driver = await findDriverUsernameandEmail(emailorusername);

    if (!driver) {
        return res.json({ msg: "Invalid username or password" ,error:true});
    }

    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
        return res.json({ msg: "Invalid password" ,error:true});
    }

    const payload = { driverid: driver.id };

    const jwtCreate = jwtTokenCreate(payload);

    res.cookie("drivertoken", jwtCreate);

    return res.json({ msg: "Driver login success", driver ,error:false});

}

//  driver forgot password
async function driverSendOtp(req,res){

    const otp = Math.floor(Math.random()*10000 + 10000)
  
      const {email,duplicate} = req.body
      if(!email){
        return res.json({msg:"please enter email",error:true})
      }
  
      const findUser = await drivers.findOne({where:{email:duplicate}})
      if(!findUser){
        return res.json({msg:"please enter valid email",error:true})
      }
  
      let updated = await drivers.update(
        { otp: otp }, 
        { where: { email: duplicate } } 
      );
      
      let num = Math.floor(Math.random()*10000+ 10000)
      console.log(num);
  
  
    const sendOtp = emailService(email,otp)
    
      return res.json({msg:"otp has been send",error:false})
  }

  async function driverChangePassword(req,res){
    const {otp ,newpassword} = req.body

    const otpFind = await drivers.findOne({where:{otp:otp}})

    if(!otpFind){
        return res.json({msg:"invalid otp",error:true})
    }
    const hasPsssword = await bcrypt.hash(newpassword,10)
    const update = await drivers.update(
        { password: hasPsssword }, 
        { where: { otp: otp } } 
    )
  return res.json({msg:"password update successfully" , update,error:false})
  }


module.exports = {
    signUp,
    logIn,
    sendOtp,
    changePassword,
    driverSignup,
    driverLogin,
    driverSendOtp,
    driverChangePassword
}