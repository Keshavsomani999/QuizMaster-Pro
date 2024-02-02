const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
});

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    options: [optionSchema],
});

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,      
    },
    isEnrolled: {
        type: Boolean,
        default: true,
    },
    score:{
        type:Number,
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    totalQuestions:{
        type:Number,
        required: true,
    },
    questions: {
        type: [questionSchema],
        validate: {
            validator: function (questions) {
                return questions.length === this.totalQuestions;
            },
            message: "Number of questions must match totalQuestions",
        },
    },
    enrolledStudents: [studentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    quizExpireTime: {
        type: Number, // Represented in minutes
        required: true,
    },
});

module.exports = mongoose.model('Quiz', quizSchema);

// module.exports = Quiz;


// module.exports = mongoose.model("Product",productSchema)