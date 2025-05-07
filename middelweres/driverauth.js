function driverauth(req,res,next){

    const token = req.cookies?.drivertoken
    if(!token){
        return res.json({msg:"please first login"})
    }
    req.driver = token
    next()

}

module.exports = { 
    driverauth
}