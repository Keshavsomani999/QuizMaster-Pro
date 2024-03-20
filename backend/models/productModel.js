const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
    
});

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [optionSchema],
    answer:{
        type:String,
        required:true
    }
});

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type:String,      
        required:true
    },
    isEnrolled: {
        type: Boolean,
        default: false,
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
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
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