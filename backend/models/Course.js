// backend/models/Course.js
const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  lessonId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String, // Can store markdown format
    required: true
  },
  contentType: {
    type: String,
    enum: ['theory', 'code-playground', 'video'],
    default: 'theory'
  },
  starterCode: {
    type: String, // Optional starter code for the coding playground
    default: ''
  },
  expectedOutput: {
    type: String, // Expected output to check validity in the playground
    default: ''
  },
  language: {
    type: String, // e.g., 'python', 'javascript', 'cpp'
    default: 'python'
  }
});

const ChapterSchema = new mongoose.Schema({
  chapterId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  lessons: [LessonSchema]
});

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String, // e.g., 'python-basics', 'sql-intro'
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Language', 'Frontend', 'Database', 'CS-Basics', 'AI-ML'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  chapters: [ChapterSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);