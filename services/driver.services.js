const driver = require("../models/driver.model")
const {Op} = require("sequelize")
const driverDocumetModel = require("../models/driverdocument.model")
const jwt = require("jsonwebtoken")
const {cloudinary,configureCloudinary} = require("../utills/cloudinary.util")


async function findDriverUsernameandEmail(emailorusername){
  
    // console.log("emailorusername",emailorusername);
    return await driver.findOne({
        where: {
          [Op.or]: [{ email: emailorusername }, { username: emailorusername }],
        },
      });
  
}

function driverIdFromRequest(req,res){
  const driverToken = req.driver
  const tokenVerify = jwt.verify(driverToken , process.env.JWT_SECRET)
  const driverId = tokenVerify.driverid
  return driverId
}

async function updateProfileImageService(file, publicId) {
    try {
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }

        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
        return uploadResult;

    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        throw new Error("Image upload failed.");
    }
}


// upload driver documents

async function uploadDriverDocumentsService(driverId, files) {
    const { pancardFile, aadharFrontFile, aadharBackFile } = files;

    const maxSize = 1 * 1024 * 1024;
    let pancardUrl = null;
    let aadharFrontUrl = null;
    let aadharBackUrl = null;

    // Upload pancard
    if (pancardFile) {
        if (pancardFile.size > maxSize) {
            throw new Error("Pancard image is too large. Max allowed size is 1MB.");
        }

        const uploadResult = await cloudinary.uploader.upload(pancardFile.tempFilePath);
        pancardUrl = uploadResult.url;
    }

    // Upload aadhar front
    if (aadharFrontFile && aadharBackFile) {
        const frontResult = await cloudinary.uploader.upload(aadharFrontFile.tempFilePath);
        aadharFrontUrl = frontResult.url;

        const backResult = await cloudinary.uploader.upload(aadharBackFile.tempFilePath);
        aadharBackUrl = backResult.url;
    } else if (aadharFrontFile || aadharBackFile) {
        throw new Error("Both front and back Aadhar images are required.");
    }

    const newDocument = await driverDocumetModel.create({
        driver_id: driverId,
        pancard: pancardUrl ? pancardUrl : null ,
        aadharcard_front: aadharFrontUrl? aadharFrontUrl :null,
        aadharcard_back: aadharBackUrl ? aadharBackUrl :null
    });

    return newDocument;
}

// update driver document services 

async function updateDriverDocumentsService(driverId, files) {
    const { pancardFile, aadharFrontFile, aadharBackFile } = files;
    const maxSize = 1 * 1024 * 1024;

    const driver = await driverDocumetModel.findOne({ where: { driver_id: driverId } });
    if (!driver) throw new Error("Driver document not found");

    let pancardUrl = driver.pancard;
    let aadharFrontUrl = driver.aadharcard_front;
    let aadharBackUrl = driver.aadharcard_back;

    // Upload and replace pancard
    if (pancardFile) {
        if (pancardFile.size > maxSize) {
            throw new Error("Pancard image is too large. Max size is 1MB.");
        }

        // Delete old file
        if (pancardUrl) {
            const oldPublicId = extractPublicId(pancardUrl);
            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }
        }

        const uploadResult = await cloudinary.uploader.upload(pancardFile.tempFilePath);
        pancardUrl = uploadResult.url;
    }

    // Upload and replace Aadhar front/back
    if (aadharFrontFile && aadharBackFile) {
        const frontResult = await cloudinary.uploader.upload(aadharFrontFile.tempFilePath);
        aadharFrontUrl = frontResult.url;

        const backResult = await cloudinary.uploader.upload(aadharBackFile.tempFilePath);
        aadharBackUrl = backResult.url;
    } else if (aadharFrontFile || aadharBackFile) {
        throw new Error("Both front and back Aadhar images must be uploaded together.");
    }

    // Update database
    const updatedDocument = await driver.update({
        pancard: pancardUrl || driver.pancard,
        aadharcard_front: aadharFrontUrl || driver.aadharcard_front,
        aadharcard_back: aadharBackUrl || driver.aadharcard_back,
    });

    return updatedDocument;
}

function extractPublicId(fileUrl) {
    try {
        const parts = fileUrl.split('/');
        const fileName = parts[parts.length - 1];
        return fileName.split('.')[0];
    } catch {
        return null;
    }
}




module.exports = {
  findDriverUsernameandEmail,
  driverIdFromRequest,
  updateProfileImageService,
  uploadDriverDocumentsService,
  updateProfileImageService,
  updateDriverDocumentsService,
}