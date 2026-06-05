// backend/routes/playground.js
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');

// @desc    Run user-submitted code in browser
// @route   POST /api/playground/run
// @access  Private (Rate limited and authenticated)
router.post('/run', protect, async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ message: 'Language and code are required' });
  }

  const supportedLanguages = ['javascript', 'python'];
  if (!supportedLanguages.includes(language.toLowerCase())) {
    return res.status(400).json({ message: 'Unsupported language for direct execution' });
  }

  const uniqueId = `${req.user._id}_${Date.now()}`;
  let tempFilePath = '';
  let command = '';

  // Set up execution properties depending on language
  if (language.toLowerCase() === 'javascript') {
    tempFilePath = path.join(__dirname, `../../temp_${uniqueId}.js`);
    fs.writeFileSync(tempFilePath, code);
    command = `node ${tempFilePath}`;
  } else if (language.toLowerCase() === 'python') {
    tempFilePath = path.join(__dirname, `../../temp_${uniqueId}.py`);
    // Basic sanitization step (production would require isolated container)
    if (code.includes('import os') || code.includes('import sys') || code.includes('open(')) {
      return res.status(400).json({ message: 'Restricted system calls detected in code' });
    }
    fs.writeFileSync(tempFilePath, code);
    command = `python3 ${tempFilePath}`;
  }

  // Execute in shell with a strict timeout (e.g., 4 seconds)
  exec(command, { timeout: 4000 }, (error, stdout, stderr) => {
    // Ensure the temporary file is cleaned up safely
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error('Error deleting temporary execution file:', err);
      }
    }

    if (error && error.killed) {
      return res.status(400).json({ output: 'Execution timed out (maximum 4 seconds exceeded)' });
    }

    if (stderr) {
      return res.status(200).json({ success: false, output: stderr });
    }

    res.status(200).json({ success: true, output: stdout });
  });
});

module.exports = router;
