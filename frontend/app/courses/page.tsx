// frontend/app/courses/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BookOpen, Trophy, Award, ArrowRight } from 'lucide-react';

interface Course {
  courseId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await api.courses.getAll();
        setCourses(response.data);
      } catch (err: any) {
        setError('Could not retrieve available courses. Make sure the server is online.');
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-slate-500 animate-pulse text-sm font-medium">Retrieving available curriculum...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Introduction Hero Block */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-sm">
        <div className="max-w-xl space-y-4">
          <span className="bg-brand-600/30 text-brand-100 text-xs font-semibold px-3 py-1 rounded-full border border-brand-500/30">
            Interactive Learning Path
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Structured Masterclasses</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Enroll in tailored paths. Accomplish milestones, earn XP points, level up, and unlock certificates.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.courseId} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between card-hover">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {course.category}
                </span>
                <span className="text-slate-400 text-xs font-semibold">
                  {course.difficulty}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 leading-snug">{course.title}</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="flex items-center text-xs text-gamification-xp font-semibold gap-1">
                <Trophy size={14} /> +200 XP
              </span>
              <a
                href={`/courses/${course.courseId}`}
                className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition gap-1"
              >
                Launch Course <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}