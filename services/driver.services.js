const driver = require("../models/driver.model")
const {Op} = require("sequelize")


async function findDriverUsernameandEmail(emailorusername){
  
    // console.log("emailorusername",emailorusername);
    return await driver.findOne({
        where: {
          [Op.or]: [{ email: emailorusername }, { username: emailorusername }],
        },
      });
  
}

module.exports = {
     findDriverUsernameandEmail,
}