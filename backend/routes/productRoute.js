const express = require("express");
const { getAllQuizs,createQuiz, updateQuiz, deleteQuiz, getQuizDetails, submitQuiz,testEmail } = require("../controllers/productController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();



router.route("/products").get(getAllQuizs);

router.route("/product/new").post(isAuthenticatedUser,createQuiz);
router.route("/product/:id").put(updateQuiz).delete(deleteQuiz).get(isAuthenticatedUser,getQuizDetails)
router.route("/quiz/submit/:id").put(isAuthenticatedUser,submitQuiz);


module.exports = router