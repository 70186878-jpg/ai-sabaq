// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  handleTutorChat,
  handleCodeReview,
  handleAssignmentGenerator,
  handleRevisionNotes
} = require('../controllers/aiController');

// @route   POST /api/ai/chat
// @desc    Interactive tutor chat (supports Beginner/Intermediate/Advanced and multiple languages)
router.post('/chat', protect, handleTutorChat);

// @route   POST /api/ai/review
// @desc    AI Code Reviewer (analyzes code quality, identifies bugs, rates source code)
router.post('/review', protect, handleCodeReview);

// @route   POST /api/ai/assignment/generate
// @desc    Dynamic assignment generator customized to course/topic context
router.post('/assignment/generate', protect, handleAssignmentGenerator);

// @route   POST /api/ai/revision/notes
// @desc    Generates summary study notes, quick flashcards, and practice questions
router.post('/revision/notes', protect, handleRevisionNotes);

module.exports = router;