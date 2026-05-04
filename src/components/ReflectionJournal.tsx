import React, { useState } from 'react';
import { BookOpen, Send, Calendar, Share2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Reflection, Habit } from '../types';
import { shareToWhatsApp, getSharingText } from '../lib/sharing';

interface ReflectionJournalProps {
  habits: Habit[];
  reflections: Reflection[];
}

export default function ReflectionJournal({ habits, reflections }: ReflectionJournalProps) {
  const [formData, setFormData] = useState({
    easiest_habit: '',
    difficult_habit: '',
    consistency_insight: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    const today = new Date().toISOString().split('T')[0];

    try {
      await addDoc(collection(db, 'reflections'), {
        ...formData,
        date: today,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setFormData({ easiest_habit: '', difficult_habit: '', consistency_insight: '' });
    } catch (error) {
      console.error("Failed to save reflection", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="px-1 md:px-0">
        <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Log</h2>
        <p className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.4em] mt-3">Debrief and calibrate your trajectory.</p>
      </div>

      <div className="card shadow-2xl p-8 md:p-12 border-none ring-1 ring-brand-dark/5 bg-white">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30 mb-8 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Daily Calibration
        </h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Easiest System?</label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
              value={formData.easiest_habit}
              onChange={e => setFormData({...formData, easiest_habit: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Most Difficult System?</label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
              value={formData.difficult_habit}
              onChange={e => setFormData({...formData, difficult_habit: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Core Insight</label>
            <textarea 
              required
              placeholder="What did you learn today?"
              className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold min-h-[100px]"
              value={formData.consistency_insight}
              onChange={e => setFormData({...formData, consistency_insight: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-primary w-full group">
            Complete Log <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30 px-1 md:px-0">Past Logs</h3>
        <div className="space-y-6">
          {reflections.map(ref => (
            <div key={ref.id} className="card p-8 border-none shadow-xl shadow-brand-dark/5 bg-white">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                  <Calendar className="w-4 h-4" /> {new Date(ref.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <button 
                  onClick={() => shareToWhatsApp(`Daily Insight: ${ref.consistency_insight}`)}
                  className="p-2 text-brand-dark/20 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="text-[9px] font-black text-brand-dark/20 uppercase tracking-widest mb-2">Success</div>
                  <p className="text-sm font-bold text-brand-dark">{ref.easiest_habit}</p>
                </div>
                <div>
                  <div className="text-[9px] font-black text-brand-dark/20 uppercase tracking-widest mb-2">Friction</div>
                  <p className="text-sm font-bold text-brand-dark">{ref.difficult_habit}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-brand-dark/5">
                <div className="text-[9px] font-black text-brand-dark/20 uppercase tracking-widest mb-2">Evolution</div>
                <p className="text-sm font-medium italic text-brand-dark/60 leading-relaxed">"{ref.consistency_insight}"</p>
              </div>
            </div>
          ))}
          {reflections.length === 0 && (
            <div className="text-center py-20 text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.3em]">No logs recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

