// backend/models/User.js
const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema({
  courseId: {
    type: String, // e.g., 'python', 'react'
    required: true
  },
  completedLessons: [{ type: String }], // Array of completed lesson IDs
  completedQuizzes: [{ type: String }],  // Array of completed quiz IDs
  completedAssignments: [{ type: String }],
  progressPercentage: {
    type: Number,
    default: 0
  },
  certificateUnlocked: {
    type: Boolean,
    default: false
  },
  certificateUrl: {
    type: String,
    default: ''
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false // Exclude password by default in queries
  },
  // Gamification properties
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  badges: [{
    badgeId: { type: String },
    title: { type: String },
    earnedAt: { type: Date, default: Date.now }
  }],
  // Course tracking
  enrolledCourses: [CourseProgressSchema],
  // Custom generated learning path steps for personalized learning feature
  personalizedPath: [{
    topic: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    recommendedResources: [{ type: String }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);