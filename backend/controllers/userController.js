const Errorhander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const Quiz = require("../models/productModel");
// Register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role, rollnumber } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    rollnumber,
  });

  sendToken(user, 201, res);
});

//Login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking usser  & pass

  if (!email || !password) {
    return next(new Errorhander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Errorhander("Invalid Email & Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new Errorhander("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

//logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // Find the user
  const user = await User.findById(req.user.id);

  // Find all quizzes created by the user
  const quizzes = await Quiz.find({ user: user._id });

  // Combine user details with quizzes created by the user
  const userDetails = {
    user,
    quizzes
  };

  res.status(200).json({
    success: true,
    userDetails,
  });
});



exports.getAllTeachers = catchAsyncErrors(async (req, res, next) => {
  const loggedInStudentRollNumber = req.user.rollnumber; // Assuming you get the roll number from the request
  
  const teachers = await User.aggregate([
    {
      $match: {
        role: "teacher",
      },
    },
    {
      $lookup: {
        from: "quizzes",
        localField: "_id",
        foreignField: "user",
        as: "quizzes",
      },
    },

    {
      $unwind: '$quizzes',
  },
  {
    $match: {
      'quizzes.enrolledStudents': {
        $elemMatch: {
          rollNumber: loggedInStudentRollNumber,
          isEnrolled: false
        }
      }
    },
  },

    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' }, // Add other fields you want to retrieve
        email: { $first: '$email' }, // Include the email field
        quizzes: { $push: '$quizzes' }, // Collect quizzes into an array
    },
    },
  ]);

  res.status(200).json({
    success: true,
    teachers,
  });
});

exports.getQuizScore = catchAsyncErrors(async (req, res, next) => {
  const loggedInStudentRollNumber = req.user.rollnumber;


  const quizzesWithScore = await User.aggregate([
    {
      $match: {
        role: "teacher", // Assuming teachers are the ones who create quizzes
      },
    },
    {
      $lookup: {
        from: "quizzes",
        localField: "_id",
        foreignField: "user",
        as: "quizzes",
      },
    },
    {
      $unwind: "$quizzes",
    },
    {
      $unwind: "$quizzes.enrolledStudents",
    },
    {
      $match: {
        "quizzes.enrolledStudents.rollNumber": loggedInStudentRollNumber,
        "quizzes.enrolledStudents.score": { $exists: true }, // Filter quizzes where the student has a score
      },
    },
    {
      $group: {
        _id: "$quizzes._id", // Group by quiz ID
        title: { $first: "$quizzes.title" }, // Assuming you want to retrieve the quiz title
        score: { $max: "$quizzes.enrolledStudents.score" }, // Retrieve the max score for each quiz
      },
    },
  ]);


  res.status(200).json({
    success: true,
    quizzesWithScore,
  });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
 const userId = req.user.id;
  
 console.log(userId);


 let user = await User.findByIdAndUpdate(userId, req.body, {
  new: true,
  runValidators: true,
  useFindAndModify:false
  });

  res.status(200).json({
    success: true,
    user,
  });
});