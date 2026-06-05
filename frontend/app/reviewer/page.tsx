// frontend/app/reviewer/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Bug, RefreshCw, Star, CodeSquare, AlertCircle } from 'lucide-react';

export default function CodeReviewerPage() {
  const [code, setCode] = useState('// Paste code here to get a detailed review\nfunction calcSum(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i]; // Bug check: index out of bounds\n  }\n  return sum;\n}');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReviewCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setReview('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/review',
        { code, language },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      setReview(response.data.review);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to fetch code review metrics. Please verify authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">AI Code Reviewer</h1>
        <p className="text-slate-500 text-sm">Analyze structures, find logical bugs, and optimize your algorithms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[550px]">
        {/* Left Side: Code Input Workspace */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-full shadow-sm">
          <div className="space-y-3 flex-grow flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                <CodeSquare size={16} /> Code Input
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold px-2 py-1 focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-grow w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-brand-500 h-full"
            />
          </div>

          <button
            onClick={handleReviewCode}
            disabled={loading}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition inline-flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={14} /> : <ShieldCheck size={14} />}
            Analyze Source Code
          </button>
        </div>

        {/* Right Side: AI Insights Dashboard */}
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="text-slate-300 text-xs font-bold inline-flex items-center gap-1.5">
              <Bug size={14} className="text-brand-500" /> AI Diagnostic Feedback
            </span>
            {review && (
              <span className="text-gamification-xp text-xs font-semibold inline-flex items-center gap-1">
                <Star size={12} className="fill-current" /> Reviewed
              </span>
            )}
          </div>

          <div className="flex-grow p-5 overflow-y-auto text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-100 flex items-center gap-1.5 font-semibold">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {review ? (
              <div className="prose prose-sm max-w-none text-xs">
                {review}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400 gap-2">
                <ShieldCheck size={36} className="text-slate-300 stroke-[1.5]" />
                <span>Submit your code on the left to see audit insights.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}