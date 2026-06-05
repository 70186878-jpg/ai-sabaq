// backend/models/Quiz.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'coding', 'fill-in-the-blank'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  prompt: {
    type: String,
    required: true
  },
  options: [{ type: String }], // Used for MCQs
  correctAnswer: {
    type: String, // For MCQs, the exact string. For fill-in-the-blank, the keyword. For coding, expected outcome or assertion.
    required: true
  },
  testCases: [{
    input: { type: String },
    output: { type: String }
  }] // Optional validation steps for coding-based quiz items
});

const QuizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    unique: true
  },
  courseId: {
    type: String, // Association with a standard course
    required: true
  },
  chapterId: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  questions: [QuestionSchema],
  isAiGenerated: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Null indicates system or standard platform quiz
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);