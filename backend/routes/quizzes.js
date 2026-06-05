// backend/routes/quizzes.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get quiz details by quiz ID
// @route   GET /api/quizzes/:quizId
// @access  Private
router.get('/:quizId', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit a quiz and calculate initial score
// @route   POST /api/quizzes/:quizId/submit
// @access  Private
router.post('/:quizId/submit', protect, async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body; // Array of { questionId, userAnswer }

  try {
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctCount = 0;
    const gradedAnswers = quiz.questions.map((q) => {
      const userAns = answers.find(a => a.questionId === q.questionId);
      const isCorrect = userAns ? userAns.userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : false;
      
      if (isCorrect) correctCount++;

      return {
        questionId: q.questionId,
        userAnswer: userAns ? userAns.userAnswer : '',
        isCorrect,
        scoreAwarded: isCorrect ? 10 : 0
      };
    });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercentage >= 70; // 70% passing threshold

    // Save the submission record
    const submission = await Submission.create({
      user: req.user.id,
      assessmentType: 'quiz',
      assessmentId: quizId,
      answers: gradedAnswers,
      score: scorePercentage,
      totalPoints: totalQuestions * 10,
      passed,
      aiFeedback: {
        summary: `You scored ${scorePercentage}% by answering ${correctCount} out of ${totalQuestions} questions correctly.`,
        improvementSuggestions: passed ? ['Good job! Move on to the next section.'] : ['Review this chapter and try the quiz again.']
      }
    });

    // Update User gamification attributes
    const user = await User.findById(req.user.id);
    if (passed) {
      // Award 50 XP bonus for passing a quiz
      user.xp += 50;
      
      // Mark quiz as completed in user progress if associated with a course
      const enrollment = user.enrolledCourses.find(c => c.courseId === quiz.courseId);
      if (enrollment && !enrollment.completedQuizzes.includes(quizId)) {
        enrollment.completedQuizzes.push(quizId);
      }
      
      const calculatedLevel = Math.floor(user.xp / 100) + 1;
      if (calculatedLevel > user.level) {
        user.level = calculatedLevel;
      }
      await user.save();
    }

    res.status(201).json({
      submission,
      userUpdatedStats: { xp: user.xp, level: user.level }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;