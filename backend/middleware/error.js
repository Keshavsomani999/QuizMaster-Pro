const Errorhandler = require("../utils/errorhander");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;

    err.message = err.message || "Internal Server Error"

    // Wrong MongoDB ID Error
    if(err.name === "CastError"){
        const message = `Resource Not Found. Invalid ${err.path}`
        err = new Errorhandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}