// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select('-chapters.lessons.content'); // Omit heavy content for list view
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single course details
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const courseId = req.params.id;

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(c => c.courseId === courseId);
    if (isEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Verify course exists
    const courseExists = await Course.findOne({ courseId });
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }

    user.enrolledCourses.push({
      courseId,
      completedLessons: [],
      progressPercentage: 0
    });

    await user.save();
    res.status(200).json({ message: 'Successfully enrolled', enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Complete a lesson inside a course
// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @access  Private
router.post('/:id/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
    const { id: courseId, lessonId } = req.params;
    const user = await User.findById(req.user.id);

    const enrollment = user.enrolledCourses.find(c => c.courseId === courseId);
    if (!enrollment) {
      return res.status(400).json({ message: 'You must enroll in this course first' });
    }

    // Avoid duplicate completions
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      
      // Award XP for completion
      user.xp += 10;
      
      // Handle simple leveling up threshold (e.g., every 100 XP)
      const calculatedLevel = Math.floor(user.xp / 100) + 1;
      if (calculatedLevel > user.level) {
        user.level = calculatedLevel;
      }
    }

    // Find course structure to compute current progress percentage
    const course = await Course.findOne({ courseId });
    if (course) {
      const totalLessonsCount = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
      enrollment.progressPercentage = totalLessonsCount > 0 
        ? Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100)
        : 100;
    }

    await user.save();
    res.status(200).json({ progress: enrollment.progressPercentage, xp: user.xp, level: user.level });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;