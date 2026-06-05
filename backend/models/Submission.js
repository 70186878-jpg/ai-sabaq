// backend/models/Submission.js
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String, // Stringified JSON, simple string, or raw code submission
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  scoreAwarded: {
    type: Number,
    default: 0
  }
}, { _id: false });

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentType: {
    type: String,
    enum: ['quiz', 'assignment'],
    required: true
  },
  assessmentId: {
    type: String, // References either quizId or assignmentId
    required: true
  },
  answers: [AnswerSchema],
  score: {
    type: Number, // Percentage or absolute points
    required: true
  },
  totalPoints: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    default: false
  },
  // Feedback from the auto-grader/AI Reviewer
  aiFeedback: {
    summary: { type: String },
    improvementSuggestions: [{ type: String }],
    reviewedAt: { type: Date, default: Date.now }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);