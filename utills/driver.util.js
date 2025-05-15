function sizeLimit(file,res){
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
        return res.status(400).json({ msg: "Your image is too large. Max allowed size is 1MB." , error:true});
    }
}


module.exports = {
    sizeLimit
}