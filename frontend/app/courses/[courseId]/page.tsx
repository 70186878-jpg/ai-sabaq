// frontend/app/courses/[courseId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../services/api';
import { BookOpen, CheckCircle, ArrowRight, Play, BookCheck } from 'lucide-react';

interface Lesson {
  lessonId: string;
  title: string;
  content: string;
  contentType: string;
  starterCode?: string;
  expectedOutput?: string;
}

interface Chapter {
  chapterId: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  courseId: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourseAndProgress() {
      try {
        const courseRes = await api.courses.getOne(courseId);
        setCourse(courseRes.data);

        // Fetch user progress to highlight completed lessons
        const profileRes = await api.auth.getProfile();
        const enrollment = profileRes.data.enrolledCourses?.find((c: any) => c.courseId === courseId);
        if (enrollment) {
          setCompletedLessons(enrollment.completedLessons || []);
        }

        // Default to selection of the first lesson
        if (courseRes.data.chapters?.[0]?.lessons?.[0]) {
          setSelectedLesson(courseRes.data.chapters[0].lessons[0]);
        }
      } catch (err: any) {
        setError('Ensure you are enrolled in this course to read the full curriculum.');
      } finally {
        setLoading(false);
      }
    }
    loadCourseAndProgress();
  }, [courseId]);

  const handleCompleteLesson = async () => {
    if (!selectedLesson || !course) return;

    try {
      await api.courses.completeLesson(course.courseId, selectedLesson.lessonId);
      if (!completedLessons.includes(selectedLesson.lessonId)) {
        setCompletedLessons([...completedLessons, selectedLesson.lessonId]);
      }
    } catch (err) {
      alert('Error updating completion progress. Are you enrolled in this course?');
    }
  };

  if (loading) {
    return <div className="text-slate-500 animate-pulse text-center py-20">Loading course curriculum...</div>;
  }

  if (error || !course) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="font-bold text-slate-800 text-lg">Curriculum Locked</h2>
        <p className="text-slate-500 text-sm leading-relaxed">{error || 'Course not found.'}</p>
        <button
          onClick={() => api.courses.enroll(courseId).then(() => window.location.reload())}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition"
        >
          Enroll in Course
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Course Outline */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 space-y-6 max-h-[600px] overflow-y-auto">
        <div>
          <h2 className="font-bold text-slate-800 text-base">{course.title}</h2>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mt-1">Syllabus Matrix</span>
        </div>
        <div className="space-y-4">
          {course.chapters.map((chapter) => (
            <div key={chapter.chapterId} className="space-y-2">
              <h3 className="font-semibold text-xs text-slate-500 uppercase">{chapter.title}</h3>
              <div className="space-y-1.5">
                {chapter.lessons.map((lesson) => {
                  const isSelected = selectedLesson?.lessonId === lesson.lessonId;
                  const isCompleted = completedLessons.includes(lesson.lessonId);

                  return (
                    <button
                      key={lesson.lessonId}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isSelected ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{lesson.title}</span>
                      {isCompleted ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 ml-1" /> : <BookOpen size={14} className="text-slate-300 flex-shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Workspace Viewport */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        {selectedLesson ? (
          <>
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-slate-800">{selectedLesson.title}</h1>
              {completedLessons.includes(selectedLesson.lessonId) ? (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-100 inline-flex items-center gap-1">
                  Completed
                </span>
              ) : (
                <button
                  onClick={handleCompleteLesson}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition"
                >
                  Mark as Complete
                </button>
              )}
            </div>

            {/* Markdown/Text Panel */}
            <div className="prose max-w-none text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
              {selectedLesson.content}
            </div>

            {selectedLesson.contentType === 'code-playground' && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href="/playground"
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition"
                >
                  <Play size={12} /> Launch Live Playground Task
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">Select a lesson from the menu outline to begin.</div>
        )}
      </div>
    </div>
  );
}