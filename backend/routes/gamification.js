// backend/routes/gamification.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get top users ranked by XP
// @route   GET /api/gamification/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select('username xp level streak');
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update and verify continuous active daily streak
// @route   POST /api/gamification/streak/check
// @access  Private
router.post('/streak/check', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date();
    const lastActiveDate = new Date(user.lastActive);

    // Calculate difference in hours between now and last active date
    const diffTime = Math.abs(today - lastActiveDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // User active on consecutive day, increment streak
      user.streak += 1;
      
      // Award badge for 7-day streak milestone
      if (user.streak === 7 && !user.badges.some(b => b.badgeId === 'streak-7')) {
        user.badges.push({ badgeId: 'streak-7', title: '7-Day Scholar' });
        user.xp += 100; // Bonus XP for achievement
      }
    } else if (diffDays > 1) {
      // Streak broken, reset
      user.streak = 1;
    }

    user.lastActive = today;
    await user.save();

    res.status(200).json({
      streak: user.streak,
      lastActive: user.lastActive,
      badges: user.badges,
      xp: user.xp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;