//  model
const driverlocation = require("../models/driverlocation")
const drivers = require("../models/driver")
const { findDriverUsernameAndEmail, driverTokenGenrate } = require("../services/driver");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const cloudinary = require("cloudinary").v2

// for uploaddin profile image setup
cloudinary.config({
    cloud_name: 'dkfhw2v5x',
    api_key: '382521327277157',
    api_secret: 'VBYrZ8DcakKpvlim-87cJH8Ap8g',
});



async function driverSignup(req, res) {

    const { first_name, last_name, email, username, password, phone, profileimage } = req.body;

    if (!first_name || !last_name || !email || !password || !phone || !username) {
        return res.status(400).json({ msg: "All required fields must be provided." });
    }

    const file = req.files.profileimage
    console.log(file);

    const maxSize = 1 * 1024 * 1024;

    // if file < 1 mb then user can't upload image

    if (file.size > maxSize) {
        return res.status(400).send("Your image is too large. Max allowed size is 1MB.");
    }

    if (!req.files || !req.files.profileimage) {
        return res.status(400).json({ msg: "Profile image is required." });
    }

    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
        console.log(uploadResult);

    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        return res.status(500).json({ msg: "Image upload failed." });
    }

    const existingDriver = await findDriverUsernameAndEmail(email);
    if (existingDriver) {
        return res.json({ msg: "Email or username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    let create = await drivers.create({
        first_name,
        last_name,
        email,
        password: hashedPassword, // Save the hashed password
        phone,
        username,
        deleted_at: null,
        profile_image: uploadResult.url,
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

//  profile update for driver
async function driverProfilUpdate(req, res) {
    const driverToken = req.cookies?.drivertoken

    const tokenVerify = jwt.verify(driverToken, process.env.JWT_SECRET)

    const driverId = tokenVerify.driverid

    console.log("id", driverId);

    

    if (!driverId) {
        return res.json({ msg: "driver id not enter by user" })
    }

    // const { first_name, last_name, email, profile, phone } = req.body

    const {
        first_name ,
        last_name ,
        email ,
        profile,
        phone
      } = req.body || {};
      

    if (!first_name && !last_name && !email && !profile && !phone && !file) {
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
        phone: phone || driver.phone,
        
    })

    return res.json({ msg: "driver update successfull", updatedriver })
}

async function driverLocations(req, res) {
    const { latitude, longitude } = req.body;

    const drivertoken = req.cookies?.drivertoken

    const tokenVerify = jwt.verify(drivertoken, process.env.JWT_SECRET)

    const driverId = tokenVerify.driverid

    console.log(driverId);

    if (!latitude || !longitude) {
        return res.json({ msg: "please enter both latitude and longitude" })
    }

    const locationcreate = await driverlocation.create({
        driverid: driverId,
        latitude,
        longitude
    })

    return res.json({ msg: "driver location add", locationcreate })

}

async function driverupdateProfileImage(req,res){

    const file = req.files.profileimage
    console.log(file);
    const drivertoken = req.cookies?.drivertoken

    const tokenVerify = jwt.verify(drivertoken, process.env.JWT_SECRET)

    const driverId = tokenVerify.driverid

    const maxSize = 10 * 1024 * 1024;

    const driver = await drivers.findOne({where:{id:driverId}})

    if(!driver){
        return res.json({msg:"driver not found"})
    }
    // if file < 1 mb then user can't upload image
    if (file.size > maxSize) {
        return res.status(400).send("Your image is too large. Max allowed size is 1MB.");
    }

    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            //  resource_type: "video"  // for uploading videos
        });
        
        const updatedriver = await driver.update({
      profile_image:uploadResult.url
        })
        return res.json({msg:"image update successfull" , data:uploadResult.url})

    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        return res.status(500).json({ msg: "Image upload failed." });
    }
}
async function getDriverAllLocation(req, res) {

    const drivertoken = req.cookies?.drivertoken

    const tokenVerify = jwt.verify(drivertoken, process.env.JWT_SECRET)

    const driverId = tokenVerify.driverid

    try {
        const driver = await drivers.findOne({
            where: { id: driverId },
            include: [{
                model: driverlocation,  // Include the vehicles related to the driver
                required: false,  // Ensure it returns even if there are no vehicles
            }]
        });

        if (!driver) {
            return { message: 'Driver not found' };
        }

        return res.json({ driver });  // This will return driver with all associated vehicles
    } catch (error) {
        console.error(error);
        return { message: 'Error fetching data' };
    }
}

module.exports = {
    driverSignup,
    driverLogin,
    driverProfilUpdate,
    driverupdateProfileImage,
    driverLocations,
    getDriverAllLocation
}