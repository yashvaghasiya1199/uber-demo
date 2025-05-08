async function userAuth(req,res,next){

    let token = req.cookies?.usertoken
    
    if(!token){
        return res.json({msg:"please first login"})
    }

    req.user = token
    next()
}

module.exports = {
    userAuth
}