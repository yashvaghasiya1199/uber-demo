const driver = require("../models/driver")
const {Op} = require("sequelize")
const jwt = require("jsonwebtoken")

async function findDriverUsernameAndEmail(emailorusername){
    // console.log("emailorusername",emailorusername);
    return await driver.findOne({
        where: {
          [Op.or]: [{ email: emailorusername }, { username: emailorusername }],
        },
      });
  
}
function driverTokenGenrate(payload){
 const jwtcreate = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"24h"})
 return jwtcreate
}
module.exports = {
     findDriverUsernameAndEmail,
     driverTokenGenrate
}