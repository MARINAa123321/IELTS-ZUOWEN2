/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookMarked, GraduationCap, Layout, NotebookPen, Quote } from 'lucide-react';
import { Note, EssayTask } from './types';
import { ESSAY_TASKS } from './constants';
import { CornellStudy } from './components/CornellStudy';
import { SmartPractice } from './components/SmartPractice';

type Tab = 'study' | 'write';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('study');
  const [currentTask, setCurrentTask] = useState<EssayTask>(ESSAY_TASKS[0]);
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (note: Note) => {
    setNotes(prev => [...prev, note]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  };

  const checkSentenceUsage = useCallback((content: string) => {
    const normalizedContent = content.toLowerCase().replace(/[.,!?;:"]/g, "").trim();
    
    setNotes(prev => {
      let changed = false;
      const updated = prev.map(note => {
        const cleanNote = note.text.toLowerCase().replace(/[.,!?;:"]/g, "").trim();
        // Match if cleanNote is relatively long and fully contained in content
        const isUsed = cleanNote.length > 10 && normalizedContent.includes(cleanNote);
        
        if (isUsed !== note.used) {
          changed = true;
          return { ...note, used: isUsed };
        }
        return note;
      });
      return changed ? updated : prev;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Global Header / Nav */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">9</div>
          <span className="font-semibold text-lg tracking-tight text-slate-900">IELTS Scholar <span className="text-slate-400 font-normal hidden sm:inline">| Interactive Notes</span></span>
        </div>

        <nav className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'study' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📖 Study Sample
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'write' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            ✍️ Practice Lab
          </button>
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden lg:block text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Current Task</p>
            <select 
              className="text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-slate-600 hover:text-blue-600 transition-colors"
              value={currentTask.id}
              onChange={(e) => setCurrentTask(ESSAY_TASKS.find(t => t.id === e.target.value) || ESSAY_TASKS[0])}
            >
              {ESSAY_TASKS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeTab)}`} alt="User" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'study' ? (
            <motion.div
              key="study-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <CornellStudy 
                task={currentTask} 
                notes={notes}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                onUpdateNote={updateNoteText}
              />
            </motion.div>
          ) : (
            <motion.div
              key="write-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <SmartPractice 
                notes={notes}
                onCheckUsage={checkSentenceUsage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Toolbar (Optional Quick Access) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/90 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl border border-white/10 gap-8">
        <div className="flex items-center gap-3 text-white/50">
           <Quote className="w-4 h-4" />
           <span className="text-xs font-mono">{notes.length} saved</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-3 text-white/50">
           <Layout className="w-4 h-4" />
           <span className="text-xs font-mono">{activeTab === 'study' ? 'Analyze' : 'Compose'}</span>
        </div>
      </div>
    </div>
  );
}

