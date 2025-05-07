const Users = require("../models/user")

const {Op} = require("sequelize")
const jwt = require("jsonwebtoken")

async function finduserbyemalorusername(emailorusername){
    console.log("emailorusername" , emailorusername);

    return await Users.findOne({
        where: {
          [Op.or]: [{ email: emailorusername }, { username: emailorusername }],
        },
      });


}
function genratetoken(payload){
 const createtoken =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"24H"})
 return createtoken
}
module.exports  = {
    finduserbyemalorusername,
    genratetoken
}