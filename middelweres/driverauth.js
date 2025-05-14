function driverAuth(req,res,next){

    const token = req.cookies?.drivertoken
    if(!token){
        return res.json({msg:"please first login",error:true})
    }
    req.driver = token
    next()

}

module.exports = { 
    driverAuth
}