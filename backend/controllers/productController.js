const Quiz = require("../models/productModel");
const Errorhander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const User = require("../models/userModel");
const { loginUser } = require("./userController");


//create

exports.createQuiz = catchAsyncErrors(async (req, res, next) => {
    
  req.body.user = req.user.id;
  
  
  const quiz = await Quiz.create(req.body);
    
    console.log("user s => ",req.user);
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
    const rollNumber = req.query.rollNumber;
    if (!rollNumber) {
      return next(new Errorhander("Roll Number is required", 400));
    }

    const enrolledStudent = quiz.enrolledStudents.find(student => student.rollNumber === rollNumber);

    if (!enrolledStudent) {
        return next(new Errorhander("Student not enrolled in the quiz", 404));
    }
    
    res.status(200).json({
        success:true,
        quiz,
        enrolledStudent
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

// submit

exports.submitQuiz = catchAsyncErrors(async (req, res, next) => {

  let quiz = await Quiz.findById(req.params.id);
  const rollNumber = req.user.rollnumber;
const {score} = req.body
  if (!quiz) {
    return res.status(500).json({
      success: false,
      message: "Quiz Not Found",
    });
  }

  const enrolledStudent = quiz.enrolledStudents.find(
    (student) => student.rollNumber === rollNumber
  );

  if (!enrolledStudent) {
    return res.status(404).json({
      success: false,
      message: "Student Not Enrolled in this Quiz",
    });
  }

  enrolledStudent.score = score;
  enrolledStudent.isEnrolled = true;

  quiz = await quiz.save()


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