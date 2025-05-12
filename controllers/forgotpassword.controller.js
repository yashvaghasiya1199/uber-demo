const { where } = require("sequelize");
const users = require("../models/user.model");
const nodemailer = require("nodemailer");
const driver = require("../models/driver.model")
const bcrypt = require("bcrypt")

async function sendOtp(req,res){

    const otp = Math.floor(Math.random()*10000 + 10000)
  
      const {email,duplicate} = req.body
      if(!email){
        return res.json({msg:"please enter email"})
      }
  
      const findUser = await users.findOne({where:{email:duplicate}})
      if(!findUser){
        return res.json({msg:"please enter valid email"})
      }
  
      let updated = await users.update(
        { otp: otp }, 
        { where: { email: duplicate } } 
      );
      
      let num = Math.floor(Math.random()*10000+ 10000)
      console.log(num);
  
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      
      (async () => {
        const info = await transporter.sendMail({
          from: '<vy.hmr@gmail.com>',
          to: email,
          subject: "Hello ✔",
          text: "Hello user",
          html: `<b>Your OTP is: ${otp}</b>`, 
  
        });
      
        console.log("Message sent:", info.messageId);
      })();
    
      return res.json({msg:"done"})
  }

  async function changePass(req,res){
    const {otp ,newpassword} = req.body

    const otpFind = await users.findOne({where:{otp:otp}})

    if(!otpFind){
        return res.json({msg:"invalid otp"})
    }
    const hasPsssword = await bcrypt.hash(newpassword,10)
    const update = await users.update(
        { password: hasPsssword }, 
        { where: { otp: otp } } 
    )
  return res.json({msg:"password update successfully" , update})
  }

  async function driverSendOtp(req,res){

    const otp = Math.floor(Math.random()*10000 + 10000)
  
      const {email,duplicate} = req.body
      if(!email){
        return res.json({msg:"please enter email"})
      }
  
      const findUser = await driver.findOne({where:{email:duplicate}})
      if(!findUser){
        return res.json({msg:"please enter valid email"})
      }
  
      let updated = await driver.update(
        { otp: otp }, 
        { where: { email: duplicate } } 
      );
      
      let num = Math.floor(Math.random()*10000+ 10000)
      console.log(num);
  
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      
      (async () => {
        const info = await transporter.sendMail({
          from: '<vy.hmr@gmail.com>',
          to: email,
          subject: "Hello ✔",
          text: "Hello user",
          html: `<b>Your OTP is: ${otp}</b>`, 
  
        });
      
        console.log("Message sent:", info.messageId);
      })();
    
      return res.json({msg:"done"})
  }
 

  async function driverChangePass(req,res){
    const {otp ,newpassword} = req.body

    const otpFind = await driver.findOne({where:{otp:otp}})

    if(!otpFind){
        return res.json({msg:"invalid otp"})
    }
    const hasPsssword = await bcrypt.hash(newpassword,10)
    const update = await driver.update(
        { password: hasPsssword }, 
        { where: { otp: otp } } 
    )
  return res.json({msg:"password update successfully" , update})
  }
  
  module.exports ={
    sendOtp,
    changePass,
    driverSendOtp,
    driverChangePass
  }