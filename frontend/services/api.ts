// frontend/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create structured Axios client
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Token from local storage
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  // Authentication services
  auth: {
    register: (data: any) => client.post('/auth/register', data),
    login: (data: any) => client.post('/auth/login', data),
    getProfile: () => client.get('/auth/me'),
  },

  // Structured course services
  courses: {
    getAll: () => client.get('/courses'),
    getOne: (courseId: string) => client.get(`/courses/${courseId}`),
    enroll: (courseId: string) => client.post(`/courses/${courseId}/enroll`),
    completeLesson: (courseId: string, lessonId: string) => 
      client.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
  },

  // Interactive Quiz evaluation
  quizzes: {
    get: (quizId: string) => client.get(`/quizzes/${quizId}`),
    submit: (quizId: string, answers: { questionId: string; userAnswer: string }[]) => 
      client.post(`/quizzes/${quizId}/submit`, { answers }),
  },

  // Browser coding sandbox
  playground: {
    runCode: (language: string, code: string) => 
      client.post('/playground/run', { language, code }),
  },

  // Gamification metrics
  gamification: {
    getLeaderboard: () => client.get('/gamification/leaderboard'),
    checkStreak: () => client.post('/gamification/streak/check'),
  },
};