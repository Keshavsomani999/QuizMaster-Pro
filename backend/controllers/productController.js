const Quiz = require("../models/productModel");
const Errorhander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const User = require("../models/userModel");
const { loginUser } = require("./userController");
const nodemailer = require("nodemailer");

//create

exports.createQuiz = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const quiz = await Quiz.create(req.body);
  // console.log(quiz.enrolledStudents);
  try {
    const students = await User.find({ role: "student" });

    // Iterate through each student
    for (const student of students) {
      // Iterate through each enrolled student in the quiz
      for (const enrolledStudent of quiz.enrolledStudents) {
        // Check if the roll numbers match
        if (enrolledStudent.rollNumber === student.rollnumber) {
          // Send email to the student
          sendEmailToStudent(student.email, quiz.title);
        }
      }
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    user.organizedQuizzes.push(quiz);
    await user.save();

    res.status(201).json({
      success: true,
      quiz,
      user,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating quiz:", error);
    next(error);
  }
});

async function sendEmailToStudent(email, quizTitle) {
  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "keshav637795@gmail.com",
      pass: "zclcettdczftfsqj",
    },
  });

  // Setup email data with unicode symbols
  let mailOptions = {
    from: '"Quiz Master" keshav637795@gmail.com',
    to: email,
    subject: "New Quiz Available",
    text: `A new quiz "${quizTitle}" is available. Check it out now!`,
    html: `
        <div style="background-color: #f4f4f4; padding: 20px;">
       
        <h2 style="align-items: center;
        margin: auto;
        justify-content: center;
        text-align: center;
        color: blue;">New Quiz Available</h2>
         
        <div style="padding: 10px 0 50px 0;
        margin-top: 10px;
        text-align: center;
        border: none;
      
        background-color:#1e7998 ;
        color: white;
        flex-direction: column;" class="bodyMail">
            <p style="font-weight: bold;
            font-size: 30px;">A new quiz "${quizTitle}" is available. Check it out now!</p>
            <button style=" padding: 10px;
            background-color: yellow;
           
            border: none;
            margin-top: 10px;" > <a href="http://localhost:3000/startQuiz" style="text-decoration: none; color: black;">Start Quiz</a></button>
        </div>
       
        <div class="footer" style="line-height: 0.2;">
        <p style="color: #555;">Best regards,</p>
        <p style="color: #555;">Quiz Master</p>
    </div>
    </div>`,
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

//get all
exports.getAllQuizs = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 2;

  const apiFeature = new ApiFeatures(Quiz.find(), req.query)
    .search()
    .pagination(resultPerPage);

  const quiz = await apiFeature.query;
  // const product = await Product.find();

  res.status(200).json({
    success: true,
    quiz,
  });
});

//get single product

exports.getQuizDetails = catchAsyncErrors(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return next(new Errorhander("Product Not Found", 404));
  }
  if (req.user.role === "student") {
    console.log(req.user.role);
    const rollNumber = req.query.rollNumber;
    if (!rollNumber) {
      return next(new Errorhander("Roll Number is required", 400));
    }

    const enrolledStudent = quiz.enrolledStudents.find(
      (student) => student.rollNumber === rollNumber
    );

    if (!enrolledStudent) {
      return next(new Errorhander("Student not enrolled in the quiz", 404));
    }

    res.status(200).json({
      success: true,
      quiz,
      enrolledStudent,
    });
  } else {
    res.status(200).json({
      success: true,
      quiz,
    });
  }
});

//update

exports.updateQuiz = catchAsyncErrors(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found",
    });
  }

  if (req.body.title && req.body.title !== quiz.title) {
    quiz.title = req.body.title; // Update title
  }

  if (
    req.body.quizExpireTime &&
    req.body.quizExpireTime !== quiz.quizExpireTime
  ) {
    quiz.quizExpireTime = req.body.quizExpireTime; // Update quizExpireTime
  }

  // Handle updates to enrolledStudents array
  if (req.body.enrolledStudents) {
    // Assuming req.body.enrolledStudents is an array of objects with rollNumber
    req.body.enrolledStudents.forEach((student) => {
      // Check if the rollNumber already exists in enrolledStudents array
      const existingStudent = quiz.enrolledStudents.find(
        (s) => s.rollNumber === student.rollNumber
      );
      if (!existingStudent) {
        // If the student is not already enrolled, add them to the enrolledStudents array
        quiz.enrolledStudents.push(student);
      }
    });
  }

  // Save the updated quiz document
  await quiz.save();

  res.status(200).json({
    success: true,
    quiz,
  });
});

// submit

exports.submitQuiz = catchAsyncErrors(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.id);
  const rollNumber = req.user.rollnumber;
  const { score } = req.body;
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

  quiz = await quiz.save();

  res.status(200).json({
    success: true,
    quiz,
  });
});

// delete

exports.deleteQuiz = catchAsyncErrors(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(500).json({
      success: false,
      message: "Quiz not found",
    });
  }

  await quiz.deleteOne();

  res.status(200).json({
    success: true,
    message: "Quiz Deleted Successfully",
  });
});
