// frontend/app/layout.tsx
import React from 'react';
import './globals.css';

export const metadata = {
  title: 'AI Tutor Platform',
  description: 'An interactive, gamified learning environment backed by AI tutoring assets.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                  Ω
                </div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">
                  TutorAI
                </span>
              </div>
              <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
                <a href="/courses" className="hover:text-brand-600 transition">Courses</a>
                <a href="/playground" className="hover:text-brand-600 transition">Playground</a>
                <a href="/leaderboard" className="hover:text-brand-600 transition">Leaderboards</a>
                <a href="/chat" className="hover:text-brand-600 transition text-brand-600 font-semibold">AI Tutor Chat</a>
              </nav>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition">
                  Sign In
                </button>
                <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition shadow-sm">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Frame */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Platform Footer */}
        <footer className="bg-white border-t border-slate-100 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} TutorAI. All rights reserved. Built using Next.js & Node.
          </div>
        </footer>
      </body>
    </html>
  );
}