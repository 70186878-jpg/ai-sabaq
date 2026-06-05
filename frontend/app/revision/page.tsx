// frontend/app/revision/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { BookMarked, Sparkles, RefreshCw, Layers, CheckCircle, AlertCircle } from 'lucide-react';

export default function RevisionPage() {
  const [subject, setSubject] = useState('React Hooks');
  const [materials, setMaterials] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRevision = async () => {
    if (!subject.trim()) return;

    setLoading(true);
    setMaterials('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/revision/notes',
        { subject },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      setMaterials(response.data.revisionMaterials);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to generate revision materials. Verify your auth state.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">AI Revision Mode</h1>
        <p className="text-slate-500 text-sm">Generate structured exam prep kits, summary notes, and study flashcards.</p>
      </div>

      {/* Subject Input Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-grow space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Subject or Topic Title</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Recursion in Python, SQL Subqueries"
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <button
            onClick={handleGenerateRevision}
            disabled={loading}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition inline-flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Generate Revision Pack
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-1.5">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Materials Output Screen */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm min-h-[300px]">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
          <BookMarked size={16} className="text-brand-600" />
          <span className="text-slate-700 text-xs font-bold">Generated Materials Pack</span>
        </div>

        <div className="p-6 whitespace-pre-line text-xs text-slate-700 leading-relaxed bg-slate-50/20">
          {materials ? (
            <div className="prose prose-sm max-w-none">
              {materials}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24 text-slate-400 gap-2">
              <Layers size={36} className="text-slate-300 stroke-[1.5]" />
              <span>Define a topic above and initiate the generator.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}