import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, Circle, PencilLine, Wand2 } from 'lucide-react';
import { Note } from '../types';

interface SmartPracticeProps {
  notes: Note[];
  onCheckUsage: (content: string) => void;
}

export const SmartPractice: React.FC<SmartPracticeProps> = ({ notes, onCheckUsage }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    onCheckUsage(content);
  }, [content, onCheckUsage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Writing Area */}
      <div className="lg:col-span-3 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden"
        >
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <PencilLine className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Practice Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent font-serif font-bold text-lg text-slate-900 focus:outline-none w-64 md:w-96 placeholder:text-slate-300"
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Draft Journal</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Word Count</span>
                <span className={`text-sm font-mono font-bold ${wordCount >= 250 ? 'text-green-500' : 'text-slate-600'}`}>
                   {wordCount} / 250
                </span>
              </div>
              <div className="w-px h-6 bg-slate-200 hidden md:block" />
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                Analyze draft
              </button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin your practice lab. Use your harvested sentences to improve your score..."
              className="w-full h-[650px] p-10 md:p-14 focus:outline-none text-slate-700 text-lg leading-relaxed font-serif resize-none"
            />
            {wordCount > 0 && wordCount < 10 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-10 text-[10px] text-slate-300 font-bold uppercase tracking-widest animate-pulse"
              >
                Drafting in progress...
              </motion.div>
            )}
          </div>
          <div className="h-10 bg-slate-50 border-t border-slate-100 flex items-center px-6 justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-green-400" /> Auto-sync enabled
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest italic">Target: Band 9.0 Standard</span>
          </div>
        </motion.div>
      </div>

      {/* Smart Reference Sidebar */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Sentence Bank</h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span className="text-[10px] text-slate-600 font-bold">{notes.filter(n => n.used).length}/{notes.length}</span>
              <CheckCircle2 className={`w-3 h-3 ${notes.filter(n => n.used).length > 0 ? 'text-green-500' : 'text-slate-200'}`} />
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="text-center py-20 px-4 border-2 border-dashed border-slate-50 rounded-2xl">
                 <Wand2 className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                 <p className="text-xs text-slate-400 leading-relaxed italic">No harvested sentences found.<br/>Visit Study Station first.</p>
              </div>
            ) : (
              notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  className={`p-4 rounded-xl border transition-all duration-700 ${
                    note.used 
                      ? 'bg-green-50 border-green-200 shadow-md ring-4 ring-green-50' 
                      : 'bg-slate-50/50 border-slate-100 opacity-60 hover:opacity-80 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <p className={`text-xs leading-relaxed font-serif ${note.used ? 'text-green-800 font-medium' : 'text-slate-500'}`}>
                      {note.text}
                    </p>
                  </div>
                  {note.used && (
                    <motion.div 
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      className="mt-3 pt-3 border-t border-green-100 flex items-center justify-between"
                    >
                      <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">Sentence Matched</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-8">
             <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Completion Rate</p>
                <div className="h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${notes.length > 0 ? (notes.filter(n => n.used).length / notes.length) * 100 : 0}%` }}
                    className="h-full bg-blue-500 rounded-full"
                   />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
