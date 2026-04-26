import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Highlighter, Info, MoreHorizontal, PenTool, Trash2 } from 'lucide-react';
import { EssayTask, Note } from '../types';
import { MORANDI_COLORS } from '../constants';

interface CornellStudyProps {
  task: EssayTask;
  notes: Note[];
  onAddNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, text: string) => void;
}

export const CornellStudy: React.FC<CornellStudyProps> = ({
  task,
  notes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
}) => {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const essayRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      e.preventDefault();
      setSelectedText(text);
      setMenuPos({ x: e.pageX, y: e.pageY });
    } else {
      setMenuPos(null);
    }
  };

  const applyHighlight = (color: string) => {
    if (!selectedText) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      text: selectedText,
      color,
      used: false,
    };
    
    onAddNote(newNote);
    setMenuPos(null);
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    const handleClick = () => setMenuPos(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Main Essay Area (Cornell Notes: Right Column for cues, Left for notes - but we use Essay as main) */}
      <div className="lg:col-span-3 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden"
          onContextMenu={handleContextMenu}
          ref={essayRef}
        >
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-3">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded border border-blue-100 tracking-wider">
                Model Analysis — Task {task.id.split('-')[1]}
              </span>
              <div className="group relative">
                <Info className="w-5 h-5 text-slate-300 cursor-help hover:text-slate-400 transition-colors" />
                <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                  {task.explanation}
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">
              {task.title}
            </h1>
            <p className="mt-2 text-xs text-slate-400 font-medium uppercase tracking-widest">{task.type}</p>
          </div>

          <div className="p-10 md:p-14 overflow-hidden relative">
            <div className="max-w-2xl mx-auto space-y-8 text-slate-700 leading-relaxed text-lg font-serif">
              {task.content.map((paragraph, idx) => (
                <p key={idx} className="relative group">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Context Menu */}
            <AnimatePresence>
              {menuPos && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  style={{ left: menuPos.x - (essayRef.current?.getBoundingClientRect().left || 0), top: menuPos.y - (essayRef.current?.getBoundingClientRect().top || 0) }}
                  className="absolute z-50 bg-white shadow-2xl rounded-xl border border-slate-200 p-2 min-w-[200px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50 mb-1 font-bold">
                    Harvest Sentence
                  </div>
                  {Object.entries(MORANDI_COLORS).map(([name, color]) => (
                    <button
                      key={name}
                      onClick={() => applyHighlight(color)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-sm text-slate-600 group text-left"
                    >
                      <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: color }}></div>
                      <span className="capitalize">{name} marker</span>
                      <Highlighter className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-12 border-t border-slate-100 flex items-center px-8 justify-between text-xs text-slate-400 font-medium">
            <span>Reading Time: ~2m</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Active Study</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cue Column/Note Bar */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Sentence Bank</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{notes.length}</span>
          </div>
          
          <div className="space-y-4 flex-1">
            <AnimatePresence mode="popLayout">
              {notes.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 px-4 border-2 border-dashed border-slate-100 rounded-2xl"
                >
                  <Highlighter className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                  <p className="text-xs text-slate-400 leading-relaxed italic">Select and right-click key sentences in the essay to collect them.</p>
                </motion.div>
              ) : (
                notes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group relative bg-slate-50/50 p-4 rounded-xl border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-slate-200"
                    style={{ borderLeft: `4px solid ${note.color}` }}
                  >
                    <textarea
                      value={note.text}
                      onChange={(e) => onUpdateNote(note.id, e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-600 focus:outline-none resize-none leading-relaxed font-serif"
                      rows={Math.max(2, Math.ceil(note.text.length / 25))}
                    />
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="absolute -right-2 -top-2 bg-white p-1.5 rounded-full shadow-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
             <div className="bg-slate-900 text-white rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Knowledge Sync</p>
                <p className="text-xs font-medium">Sentences will be available in Practice Wing</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
