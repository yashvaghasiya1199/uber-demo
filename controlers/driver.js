//  model
const driverlocation = require("../models/driverlocation")
const drivers = require("../models/driver")
const { findDriverUsernameAndEmail, driverTokenGenrate } = require("../services/driver");
const jwt = require("jsonwebtoken")
const bcrypt  = require("bcrypt")

async function driverSignup(req, res) {

    const { first_name, last_name, email, username, password, profile, phone } = req.body;
    if (!first_name || !last_name || !email || !password || !phone || !username || !profile) {
        return res.status(400).json({ msg: "All required fields must be provided." });
    }

    const existingDriver = await findDriverUsernameAndEmail(email);
    if (existingDriver) {
        return res.json({ msg: "Email or username already exists." });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    let create = await drivers.create({
        first_name,
        last_name,
        email,
        password: hashedPassword, // Save the hashed password
        phone,
        username,
        profile,
        deleted_at: null,
    });

    return res.json({ msg: "Driver signup success", create });
}


async function driverLogin(req, res) {
    const { emailorusername, password } = req.body;
    if (!emailorusername || !password) {
        return res.json({ msg: "Please enter both fields" });
    }

    let driver = await findDriverUsernameAndEmail(emailorusername);
    if (!driver) {
        return res.json({ msg: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
        return res.json({ msg: "Invalid password" });
    }

    const payload = { driverid: driver.id };
    const jwtCreate = driverTokenGenrate(payload);
    res.cookie("drivertoken", jwtCreate);

    return res.json({ msg: "Driver login success", driver });
}

async function driverProfilUpdate(req, res) {
    // const driverid = req.params.driverid
    const driverToken = req.cookies?.drivertoken

    const tokenVerify = jwt.verify(driverToken , process.env.JWT_SECRET)

    const driverId = tokenVerify.driverid

    console.log("id" , driverId);
    
    if (!driverId) {
        return res.json({ msg: "driver id not enter by user" })
    }

    const { first_name, last_name, email, profile, phone } = req.body

    if (!first_name && !last_name && !email && !profile && !phone) {
        return res.json({ msg: "no fild for update atleast enter one fild for update" })
    }

    let driver = await drivers.findOne({ where: { id: driverId } })

    if (!driver) {
        return res.json({ msg: "driver id not found" })
    }

    let updatedriver = await driver.update({
        first_name: first_name || driver.first_name,
        last_name: last_name || driver.last_name,
        email: email || driver.email,
        profile: profile || driver.profile,
        phone: phone || driver.phone
    })

    return res.json({ msg: "driver update successfull", updatedriver })
}

async function driverLocations(req,res){
    const {latitude, longitude } = req.body;

    const drivertoken = req.cookies?.drivertoken

    const tokenVerify = jwt.verify(drivertoken , process.env.JWT_SECRET)

    const driverId = tokenVerify.driverid

    console.log(driverId);
    
    if(!latitude || !longitude){
        return res.json({msg:"please enter both latitude and longitude"})
    }

    const locationcreate = await driverlocation.create({
       driverid: driverId,
       latitude,
       longitude
    })

    return res.json({msg:"driver location add" ,locationcreate})

}

module.exports = {
    driverSignup,
    driverLogin,
    driverProfilUpdate,
    driverLocations
}