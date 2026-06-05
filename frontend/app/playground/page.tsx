// frontend/app/playground/page.tsx
'use client';

import React, { useState } from 'react';
import { api } from '../../services/api';
import { Play, Code, RefreshCw, Terminal, AlertCircle } from 'lucide-react';

export default function PlaygroundPage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Future Developer"))');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isErrorOutput, setIsErrorOutput] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    if (selectedLang === 'python') {
      setCode('def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Future Developer"))');
    } else {
      setCode('function greet(name) {\n    return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Future Developer"));');
    }
  };

  const handleRunCode = async () => {
    setLoading(true);
    setOutput('Compiling and running environment code...');
    setIsErrorOutput(false);

    try {
      const res = await api.playground.runCode(language, code);
      if (res.data.success === false) {
        setIsErrorOutput(true);
      }
      setOutput(res.data.output || 'Code executed successfully with empty output.');
    } catch (err: any) {
      setIsErrorOutput(true);
      setOutput(err.response?.data?.message || 'Execution error. Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Coding Sandbox</h1>
          <p className="text-slate-500 text-sm">Write, execute, and verify code blocks dynamically.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (Node.js)</option>
          </select>
          <button
            onClick={handleRunCode}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition disabled:bg-slate-300"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
            Run Output
          </button>
        </div>
      </div>

      {/* Editor & Terminal Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        {/* Code Input Area */}
        <div className="flex flex-col border border-slate-200 rounded-xl bg-slate-900 overflow-hidden shadow-sm h-full">
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2.5 flex items-center gap-2">
            <Code size={16} className="text-slate-400" />
            <span className="text-slate-300 text-xs font-semibold">Source Editor</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-grow bg-slate-950 text-slate-100 font-mono text-sm p-4 w-full h-full resize-none focus:outline-none"
          />
        </div>

        {/* Live Terminal Output Panel */}
        <div className="flex flex-col border border-slate-200 rounded-xl bg-slate-950 overflow-hidden shadow-sm h-full">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-slate-400" />
              <span className="text-slate-300 text-xs font-semibold font-mono">Console Logs</span>
            </div>
            {isErrorOutput && (
              <span className="inline-flex items-center gap-1 text-red-400 text-xs font-semibold">
                <AlertCircle size={12} /> Execution Failed
              </span>
            )}
          </div>
          <pre className={`flex-grow p-4 font-mono text-sm overflow-auto ${isErrorOutput ? 'text-red-400' : 'text-emerald-400'}`}>
            {output || '$ Terminal ready. Write your source code and press Run.'}
          </pre>
        </div>
      </div>
    </div>
  );
}