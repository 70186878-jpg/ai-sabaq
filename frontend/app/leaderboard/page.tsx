// frontend/app/leaderboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Trophy, Flame, ShieldAlert, Star } from 'lucide-react';

interface LeaderboardUser {
  _id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await api.gamification.getLeaderboard();
        setUsers(response.data);
      } catch (err: any) {
        setError('Unable to reach the global leaderboard service.');
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-slate-500 animate-pulse text-sm font-medium">Fetching global student database...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Honor Roll Leaderboard</h1>
        <p className="text-slate-500 text-sm">Study daily, submit quizzes, and compete with active learners around the globe.</p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-100 flex items-center gap-2">
          <ShieldAlert size={16} /> {error}
        </div>
      )}

      {/* Global Rankings List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 grid grid-cols-12 text-xs font-bold text-slate-500 tracking-wider">
          <div className="col-span-2">RANK</div>
          <div className="col-span-5">STUDENT</div>
          <div className="col-span-2 text-center">STREAK</div>
          <div className="col-span-1 text-center">LEVEL</div>
          <div className="col-span-2 text-right">TOTAL XP</div>
        </div>

        <div className="divide-y divide-slate-100">
          {users.map((user, index) => {
            const isTopThree = index < 3;
            const rankColors = ['bg-amber-100 text-amber-800', 'bg-slate-100 text-slate-700', 'bg-orange-100 text-orange-800'];

            return (
              <div key={user._id} className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/50 transition">
                <div className="col-span-2">
                  {isTopThree ? (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${rankColors[index]}`}>
                      {index + 1}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs font-bold pl-1.5">{index + 1}</span>
                  )}
                </div>
                <div className="col-span-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs uppercase">
                    {user.username.slice(0, 2)}
                  </div>
                  <span className="font-semibold text-sm text-slate-800">{user.username}</span>
                </div>
                <div className="col-span-2 text-center">
                  {user.streak > 0 ? (
                    <span className="inline-flex items-center gap-1 text-gamification-streak text-xs font-bold">
                      <Flame size={14} className="fill-current" /> {user.streak} days
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-medium">-</span>
                  )}
                </div>
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center gap-0.5 text-gamification-level text-xs font-bold">
                    <Star size={12} className="fill-current" /> {user.level}
                  </span>
                </div>
                <div className="col-span-2 text-right font-bold text-sm text-slate-800 font-mono">
                  {user.xp} <span className="text-[10px] text-slate-400 font-sans">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}