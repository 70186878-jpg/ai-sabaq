// backend/scripts/seed.js
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-learning-platform';

const mockCourses = [
  {
    courseId: 'python-basics',
    title: 'Python Essentials',
    description: 'Learn the fundamentals of Python programming language from variables to control structures.',
    category: 'Language',
    difficulty: 'Beginner',
    chapters: [
      {
        chapterId: 'py-ch1',
        title: 'Variables and Data Types',
        lessons: [
          {
            lessonId: 'py-l1',
            title: 'Introduction to Python',
            content: '# Welcome to Python\n\nPython is a high-level language.\n\n`print("Hello, World!")`',
            contentType: 'theory'
          },
          {
            lessonId: 'py-l2',
            title: 'Declaring Variables',
            content: 'Write a program to set x to 10 and print x.',
            contentType: 'code-playground',
            starterCode: 'x = 10\nprint(x)',
            expectedOutput: '10\n',
            language: 'python'
          }
        ]
      }
    ]
  }
];

const mockQuizzes = [
  {
    quizId: 'py-quiz-1',
    courseId: 'python-basics',
    chapterId: 'py-ch1',
    title: 'Python Chapter 1 Checkpoint',
    questions: [
      {
        questionId: 'py-q1',
        type: 'mcq',
        difficulty: 'beginner',
        prompt: 'Which data type represents true or false values in Python?',
        options: ['bool', 'int', 'str', 'float'],
        correctAnswer: 'bool'
      },
      {
        questionId: 'py-q2',
        type: 'fill-in-the-blank',
        difficulty: 'beginner',
        prompt: 'What keyword is used to define a function in Python?',
        correctAnswer: 'def'
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Seeding process: Database Connected.');

    // Clear existing configurations
    await Course.deleteMany({});
    await Quiz.deleteMany({});

    // Seed Courses
    await Course.insertMany(mockCourses);
    console.log('Successfully seeded Course datasets.');

    // Seed Quizzes
    await Quiz.insertMany(mockQuizzes);
    console.log('Successfully seeded Quiz datasets.');

    mongoose.connection.close();
    console.log('Database seeding process complete.');
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
};

seedDB();