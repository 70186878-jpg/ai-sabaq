// frontend/app/chat/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Send, User, Bot, HelpCircle, MessageSquare, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'assistant', text: "Hello! I'm your interactive AI Tutor. What programming concept or challenge would you like to cover today?" }
  ]);
  const [input, setInput] = useState('');
  const [difficultyMode, setDifficultyMode] = useState('beginner');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setError('');
    const userMsgId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: input
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      // Fetch token from storage
      const token = localStorage.getItem('token');
      
      // Post request to our AI chat endpoint
      const response = await axios.post(
        'http://localhost:5000/api/ai/chat',
        {
          prompt: input,
          complexityMode: difficultyMode,
          language: targetLanguage
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );

      const aiMsgId = (Date.now() + 1).toString();
      const aiReply: ChatMessage = {
        id: aiMsgId,
        sender: 'assistant',
        text: response.data.reply
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect to the AI service. Verify your authentication status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
      {/* Parameter Control Bar */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare size={18} className="text-brand-600" />
            <h2 className="font-bold text-slate-800 text-sm">Tutor Settings</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Explanation Complexity</label>
            <select
              value={difficultyMode}
              onChange={(e) => setDifficultyMode(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            >
              <option value="beginner">Beginner (Analogies & Simplicity)</option>
              <option value="intermediate">Intermediate (Implementation & Context)</option>
              <option value="advanced">Advanced (Optimization & Architecture)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Output Language</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            >
              <option value="English">English</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-start gap-2">
          <HelpCircle size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <span className="text-[10px] text-slate-400 leading-relaxed">
            The tutor adapts explanation structures and patterns on-the-fly based on selected styles.
          </span>
        </div>
      </div>

      {/* Main Messaging Panel */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold border-b border-red-100 flex items-center gap-1.5">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Messages list view */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4 h-[400px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-brand-50' : 'bg-slate-100'}`}>
                {msg.sender === 'user' ? <User size={14} className="text-brand-600" /> : <Bot size={14} className="text-slate-600" />}
              </div>
              <div className={`rounded-xl p-3 text-xs leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[80%] items-center text-slate-400 text-xs animate-pulse">
              <Bot size={14} /> AI is thinking...
            </div>
          )}
        </div>

        {/* Input Text Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-grow border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}