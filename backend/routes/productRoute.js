const express = require("express");
const { getAllQuizs,createQuiz, updateQuiz, deleteQuiz, getQuizDetails } = require("../controllers/productController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();



router.route("/products").get(getAllQuizs);
router.route("/product/new").post(isAuthenticatedUser,createQuiz);
router.route("/product/:id").put(updateQuiz).delete(deleteQuiz).get(getQuizDetails);



module.exports = router