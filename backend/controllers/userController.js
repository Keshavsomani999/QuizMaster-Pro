const Errorhander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken")

// Register

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password
    })


    sendToken(user,201,res);
});

//Login

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{


    const {email,password} = req.body;

    //checking usser  & pass

    if(!email || !password){
        return next(new Errorhander("Please Enter Email & Password",400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new Errorhander("Invalid Email & Password",401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new Errorhander("Invalid Email or Password",401))
    }

    sendToken(user,200,res);

})

//logout

exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})