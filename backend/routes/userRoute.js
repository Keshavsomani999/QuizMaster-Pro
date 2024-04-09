const express = require("express");
const { registerUser, loginUser, logout,getUserDetails, getAllTeachers,updateUser,getQuizScore } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/getTeachers").get(isAuthenticatedUser,getAllTeachers);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/updateUser").put(isAuthenticatedUser,updateUser);
router.route("/QuizScore").get(isAuthenticatedUser,getQuizScore);


module.exports = router;