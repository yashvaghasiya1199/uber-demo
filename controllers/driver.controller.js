//  models
const driverlocation = require("../models/driverlocation.model")
const drivers = require("../models/driver.model")
const driverDocumetModel = require("../models/driverdocument.model")
const Vehicle = require("../models/vehicle.model")
const reviews = require("../models/review.model")

const { findDriverUsernameandEmail, driverIdFromRequest, updateProfileImageService, uploadDriverDocumentsService, updateDriverDocumentsService } = require("../services/driver.services");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const { jwtTokenCreate } = require("../utills/jwtToken.utill");
const review = require("../models/review.model")
const cloudinary = require("cloudinary").v2

// for uploaddin profile image setup
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

async function driverProfilUpdate(req, res) {

    const driverId = driverIdFromRequest(req,res)

    if (!driverId) {
        return res.json({ msg: "driver id not enter by user" })
    }

    // const { first_name, last_name, email, profile, phone } = req.body

    const {
        first_name,
        last_name,
        email,
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

    const driverId = driverIdFromRequest(req,res)

    console.log(driverId);

    if (!latitude || !longitude) {
        return res.json({ msg: "please enter both latitude and longitude" })
    }

    const locationcreate = await driverlocation.create({
        driver_id: driverId,
        driverid:driverId,
        latitude,
        longitude
    })

    return res.json({ msg: "driver location add", locationcreate })

}

async function getDriverAllLocation(req, res) {


    const driverId = driverIdFromRequest(req,res)

    try {
        const driver = await drivers.findOne({
            where: { id: driverId },
            include: [{
                model: driverlocation,
                required: false,
            }]
        });

        if (!driver) {
            return { message: 'Driver not found' };
        }

        return res.json({ driver });
    } catch (error) {
        console.error(error);
        return { message: 'Error fetching data' };
    }
}




async function driverUpdateProfileImage(req, res) {
    try {
        const file = req?.files?.profileimage;

        if (!file) {
            return res.status(400).json({ msg: "Please select an image" });
        }

        const driverId = driverIdFromRequest(req, res);
        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            return res.status(400).json({ msg: "Your image is too large. Max allowed size is 10MB." });
        }

        const driver = await drivers.findOne({ where: { id: driverId } });

        if (!driver) {
            return res.status(404).json({ msg: "Driver not found" });
        }

        const url = driver.profile_image || "";
        const parts = url.split("/");
        const fileWithExt = parts[parts.length - 1];
        const publicId = fileWithExt.split('.')[0];

        const uploadResult = await updateProfileImageService(file, publicId);

        const updateProfile = await driver.update({ profile_image: uploadResult.url });

        return res.json({ msg: "Image updated successfully", url: uploadResult.url });

    } catch (err) {
        console.error("Error updating profile image:", err);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

module.exports = {
    driverUpdateProfileImage
};


//  driver's document uploads

async function driverDocument(req, res) {
    try {
        const driverId = driverIdFromRequest(req, res);

        const pancardFile = req.files?.pancard || null;
        const aadharFrontFile = req.files?.aadharfront || null;
        const aadharBackFile = req.files?.aadharback || null;

        if (!pancardFile && (!aadharFrontFile || !aadharBackFile)) {
            return res.status(400).json({ msg: "Please upload required documents." });
        }

        const result = await uploadDriverDocumentsService(driverId, {
            pancardFile,
            aadharFrontFile,
            aadharBackFile
        });

        return res.json({ msg: "File upload successful", data: result });

    } catch (error) {
        console.error("Document Upload Error:", error);
        return res.status(500).json({ msg: error.message || "Internal Server Error" });
    }
}

module.exports = {
    driverDocument
};

// update driver documents

async function updateDriverDocument(req, res) {
    try {
        const driverId = driverIdFromRequest(req, res);

        const pancardFile = req.files?.pancard || null;
        const aadharFrontFile = req.files?.aadharfront || null;
        const aadharBackFile = req.files?.aadharback || null;

        const updatedDocument = await updateDriverDocumentsService(driverId, {
            pancardFile,
            aadharFrontFile,
            aadharBackFile
        });

        return res.json({ msg: "Driver documents updated successfully", data: updatedDocument });
    } catch (error) {
        console.error("Update Document Error:", error);
        return res.status(500).json({ msg: error.message || "Failed to update documents" });
    }
}

module.exports = {
    updateDriverDocument
};


async function driverAllInformation(req, res) {

    const driverId = req.params.driverId

    try {
        const driverData = await drivers.findOne({
            where: { id: driverId },
            include: [
                {
                    model: driverDocumetModel,
                    as: 'driverdocument',
                },
                {
                    model: Vehicle,
                    as: 'vehicles',
                },
            ],
        });

        if (!driverData) {
            return { message: 'Driver not found' };
        }

        return res.json({ driverData });
    } catch (error) {
        console.error('Error fetching driver info:', error);
        throw new Error('Error fetching driver info');
    }
};

async function AllDriverReviews(req, res) {

    const driverId = driverIdFromRequest(req,res)
    console.log(driverId);


    const findreview = await reviews.findAll({ where: { driver_id: driverId } })

    if (!findreview) {
        return res.json({ msg: "driver have not review" })
    }
    return res.json({ findreview })
}


module.exports = {
    driverProfilUpdate,
    driverUpdateProfileImage,
    driverLocations,
    getDriverAllLocation,
    driverDocument,
    updateDriverDocument,
    driverAllInformation,
    AllDriverReviews,
}