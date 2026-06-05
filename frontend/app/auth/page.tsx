// frontend/app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const response = await axios.post(url, payload);
      
      // Store dynamic token securely inside client storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      setSuccess(`Welcome back, ${response.data.username}! Redirecting to masterclasses...`);
      setTimeout(() => {
        window.location.href = '/courses';
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Review submission details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Switch Header Panel */}
      <div className="grid grid-cols-2 border-b border-slate-200">
        <button
          onClick={() => { setIsLogin(true); setError(''); }}
          className={`py-4 text-xs font-bold transition flex items-center justify-center gap-1.5 ${isLogin ? 'bg-slate-50 text-brand-600 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LogIn size={14} /> Log In
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(''); }}
          className={`py-4 text-xs font-bold transition flex items-center justify-center gap-1.5 ${!isLogin ? 'bg-slate-50 text-brand-600 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <UserPlus size={14} /> Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-1.5">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100 flex items-center gap-1.5">
            <ShieldCheck size={14} /> {success}
          </div>
        )}

        {!isLogin && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2.5 rounded-lg transition disabled:bg-slate-300"
        >
          {loading ? 'Processing session...' : isLogin ? 'Enter Workspace' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}