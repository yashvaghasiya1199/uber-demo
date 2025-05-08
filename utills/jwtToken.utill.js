const jwt = require("jsonwebtoken")

function jwtTokenCreate(payload){
    const jwtcreate = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"24h"})
    return jwtcreate
   }

module.exports = { 
    jwtTokenCreate
}