const Quiz = require("../models/productModel");
const Errorhander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const User = require("../models/userModel");


//create

exports.createQuiz = catchAsyncErrors(async (req, res, next) => {
    const quiz = await Quiz.create(req.body);
    console.log(req.user.id);
    const userId = req.user.id;
    const user = await User.findById(userId);
    user.organizedQuizzes.push(quiz);
    await user.save();
    // await user.populate('organizedQuizzes');
    res.status(201).json({
      success: true,
      quiz,
      user
    });
  });

//get all
exports.getAllQuizs = catchAsyncErrors(async (req, res) => {

  const resultPerPage = 2;

  const apiFeature = new ApiFeatures(Quiz.find(),req.query).search().pagination(resultPerPage);

  const quiz = await apiFeature.query;
  // const product = await Product.find();

  res.status(200).json({
    success: true,
    quiz,
  });
});


//get single product

exports.getQuizDetails = catchAsyncErrors(async(req,res,next)=>{
    const quiz = await Quiz.findById(req.params.id);
    if(!quiz){
        return next(new Errorhander("Product Not Found",404))
    }
    res.status(200).json({
        success:true,
        quiz
    })
})

//update

exports.updateQuiz = catchAsyncErrors(async (req, res, next) => {

  let quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(500).json({
      success: false,
      message: "Quiz Not Found",
    });
  }

  quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify:false
  });

  res.status(200).json({
    success:true,
    quiz
  })


});

// delete

exports.deleteQuiz = catchAsyncErrors(async(req,res,next) =>{

    const quiz = await Quiz.findById(req.params.id);
    if(!quiz){
        return res.status(500).json({
            success:false,
            message:"Quiz not found"
        })
    }

    await quiz.deleteOne();

    res.status(200).json({
        success:true,
        message:"Quiz Deleted Successfully"
    })

})