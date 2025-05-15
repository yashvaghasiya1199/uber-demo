//  models
const driverlocation = require("../models/driverlocation.model")
const drivers = require("../models/driver.model")
const driverDocumetModel = require("../models/driverdocument.model")
const Vehicle = require("../models/vehicle.model")
const reviews = require("../models/review.model")
const {cloudinary,configureCloudinary} = require("../utills/cloudinary.util")
const { driverIdFromRequest, updateProfileImageService, uploadDriverDocumentsService, updateDriverDocumentsService } = require("../services/driver.services");
const { sizeLimit } = require("../utills/driver.util")
const { fn, col } = require("sequelize")

async function driverProfilUpdate(req, res) {

    const driverId = driverIdFromRequest(req,res)

    if (!driverId) {
        return res.json({ msg: "driver id is not enter " , error:true })
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
        return res.json({ msg: "no fild for update atleast enter one fild for update", error:true})
    }

    let driver = await drivers.findOne({ where: { id: driverId } })

    if (!driver) {
        return res.json({ msg: "driver id not found", error:true })
    }

    let updatedriver = await driver.update({
        first_name: first_name || driver.first_name,
        last_name: last_name || driver.last_name,
        email: email || driver.email,
        profile: profile || driver.profile,
        phone: phone || driver.phone,

    })

    return res.json({ msg: "driver update successfull", updatedriver , error:false})
}


async function driverLocations(req, res) {

    const { latitude, longitude } = req.body;

    const driverId = driverIdFromRequest(req,res)

    console.log(driverId);

    if (!latitude || !longitude) {
        return res.json({ msg: "please enter both latitude and longitude" , error:true})
    }

    const locationcreate = await driverlocation.create({
        driver_id: driverId,
        driverid:driverId,
        latitude,
        longitude
    })

    return res.json({ msg: "driver location add", locationcreate , error:false})

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
            return { message: 'Driver not found', error:true };
        }

        return res.json({ driver, error:false });
    } catch (error) {
        console.error(error);
        return { message: 'Error fetching data' , error:true};
    }
}


async function driverUpdateProfileImage(req, res) {
    try {
        const file = req?.files?.profileimage;

        if (!file) {
            return res.status(400).json({ msg: "Please select an image" , error:true});
        }

        const driverId = driverIdFromRequest(req, res);
        
           const limitedSize =  sizeLimit(file,res)
        const driver = await drivers.findOne({ where: { id: driverId } });

        if (!driver) {
            return res.status(404).json({ msg: "Driver not found" , error:true});
        }

        const url = driver.profile_image || "";
        const parts = url.split("/");
        const fileWithExt = parts[parts.length - 1];
        const publicId = fileWithExt.split('.')[0];

        const uploadResult = await updateProfileImageService(file, publicId);

        const updateProfile = await driver.update({ profile_image: uploadResult.url });

        return res.json({ msg: "Image updated successfully", url: uploadResult.url , error:false});

    } catch (err) {
        console.error("Error updating profile image:", err);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

//  driver's document uploads

async function driverDocument(req, res) {
    try {
        const driverId = driverIdFromRequest(req, res);

        const pancardFile = req.files?.pancard || null;
        const aadharFrontFile = req.files?.aadharfront || null;
        const aadharBackFile = req.files?.aadharback || null;

        if (!pancardFile && (!aadharFrontFile || !aadharBackFile)) {
            return res.status(400).json({ msg: "Please upload required documents." , error:true});
        }

        const result = await uploadDriverDocumentsService(driverId, {
            pancardFile,
            aadharFrontFile,
            aadharBackFile
        });

        return res.json({ msg: "File upload successful", data: result, error:false });

    } catch (error) {
        console.error("Document Upload Error:", error);
        return res.status(500).json({ msg: error.message || "Internal Server Error", error:true });
    }
}



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

        return res.json({ msg: "Driver documents updated successfully", data: updatedDocument , error:false});
    } catch (error) {
        console.error("Update Document Error:", error);
        return res.status(500).json({ msg: error.message || "Failed to update documents", error:true });
    }
}

async function driverAllInformation(req, res) {

    const driverId = req.params.id

    try {
        const driverData = await drivers.findOne({
            where: { id: driverId },
            include: [
                {
                    model: driverDocumetModel,
                },
                {
                    model: Vehicle,
                },
            ],
        });

        if (!driverData) {
            return { message: 'Driver not found',error:true};
        }

        return res.json({ driverData,error:false });
    } catch (error) {
        console.error('Error fetching driver info:', error);
        throw new Error('Error fetching driver info');
    }
};

// average reviews
async function AllDriverReviews(req, res) {
    try {
        const driverId = driverIdFromRequest(req, res);
        console.log(driverId);

        // Get all reviews for the driver
        const findreview = await reviews.findAll({
            where: {
                driver_id: driverId,
                deleted_at: null, // Ignore soft-deleted reviews
            },
        });

        // If no reviews found
        if (!findreview || findreview.length === 0) {
            return res.json({ msg: "Driver has no reviews", error: true });
        }

        // Calculate average rating
        const avgResult = await reviews.findOne({
            attributes: [[fn("AVG", col("rating")), "average_rating"]],
            where: {
                driver_id: driverId,
                deleted_at: null,
            },
            raw: true,
        });

        const averageRating = parseFloat(avgResult.average_rating).toFixed(2);

        return res.json({
            reviews: findreview,
            averageRating,
            error: false,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error", error: true });
    }
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