import React, { useState } from 'react';
import { Plus, Trash2, Zap, Target, Sparkles, Layers, Share2 } from 'lucide-react';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Habit, Identity } from '../types';
import { shareToWhatsApp, getSharingText } from '../lib/sharing';

interface HabitListProps {
  habits: Habit[];
  identities: Identity[];
}

export default function HabitList({ habits, identities }: HabitListProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Health',
    daily_target: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    description: '',
    cue: '',
    reward: '',
    identity_id: '',
    stack_after_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'habits'), {
        ...formData,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setShowForm(false);
      setFormData({
        name: '',
        category: 'Health',
        daily_target: '',
        difficulty: 'Easy',
        description: '',
        cue: '',
        reward: '',
        identity_id: '',
        stack_after_id: ''
      });
    } catch (error) {
      console.error("Failed to create habit", error);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!confirm("Destroy this system forever? Output data will be lost.")) return;
    try {
      await deleteDoc(doc(db, 'habits', id));
    } catch (error) {
      console.error("Failed to delete habit", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-1 md:px-0">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">System Design</h2>
          <p className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.4em] mt-3">Precision biological programming.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary w-full sm:w-auto"
        >
          <div className="p-1 px-2.4 bg-white/20 rounded-lg mr-2">
            <Plus className="w-5 h-5" />
          </div>
          New System
        </button>
      </div>

      {showForm && (
        <div className="card bg-white border-brand-dark/10 shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="w-32 h-32 text-brand-primary" strokeWidth={3} />
          </div>
          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1">System Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Deep Reading"
                  className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1">Daily Target</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., 5 pages, 10 mins"
                  className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
                  value={formData.daily_target}
                  onChange={e => setFormData({...formData, daily_target: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1">Sphere</label>
                <select 
                  className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Health</option>
                  <option>Learning</option>
                  <option>Work</option>
                  <option>Mindfulness</option>
                  <option>Social</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1">Friction</label>
                <select 
                  className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold cursor-pointer"
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value as any})}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 ml-1">Identity Anchor</label>
                <select 
                  className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold cursor-pointer"
                  value={formData.identity_id}
                  onChange={e => setFormData({...formData, identity_id: e.target.value})}
                >
                  <option value="">None</option>
                  {identities.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 bg-brand-dark/5 rounded-3xl border border-brand-dark/5">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2 ml-1">
                  <Target className="w-3 h-3 text-brand-primary" /> System Cue
                </label>
                <input 
                  type="text" 
                  placeholder="When I open my laptop..."
                  className="w-full p-4 bg-white rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none transition-all font-bold"
                  value={formData.cue}
                  onChange={e => setFormData({...formData, cue: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 flex items-center gap-2 ml-1">
                  <Sparkles className="w-3 h-3 text-brand-secondary" /> System Reward
                </label>
                <input 
                  type="text" 
                  placeholder="A fresh cup of tea"
                  className="w-full p-4 bg-white rounded-2xl border-2 border-transparent focus:border-brand-primary outline-none transition-all font-bold"
                  value={formData.reward}
                  onChange={e => setFormData({...formData, reward: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary w-full sm:w-auto">Cancel</button>
              <button type="submit" className="btn-primary w-full sm:w-auto">Activate System</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {habits.map(habit => (
          <div key={habit.id} className="card group p-6 hover:border-brand-secondary hover:translate-y-[-8px] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-black text-xl tracking-tight truncate group-hover:text-brand-dark transition-colors">{habit.name}</h3>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl whitespace-nowrap ${
                    habit.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                    habit.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {habit.difficulty}
                  </span>
                </div>
                <div className="text-xs font-black text-brand-dark/40 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3 h-3 text-brand-primary" /> {habit.daily_target}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => shareToWhatsApp(getSharingText('habit', habit))}
                  className="p-2 text-brand-dark/40 hover:text-brand-secondary transition-colors hover:bg-brand-secondary/10 rounded-xl"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => habit.id && deleteHabit(habit.id)}
                  className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mt-6 pt-6 border-t border-brand-dark/5">
              {habit.cue && (
                <div className="text-xs font-bold text-brand-dark/60 flex items-start gap-3">
                  <div className="p-1 px-1.5 bg-brand-accent/20 rounded-lg shrink-0 mt-0.4">
                    <Zap className="w-3 h-3 text-brand-accent fill-white" /> 
                  </div>
                  <span className="leading-relaxed font-bold tracking-tight"><span className="text-brand-dark/30 font-black uppercase text-[9px] block">CUE</span> {habit.cue}</span>
                </div>
              )}
              {habit.reward && (
                <div className="text-xs font-bold text-brand-dark/60 flex items-start gap-3">
                  <div className="p-1 px-1.5 bg-brand-secondary/20 rounded-lg shrink-0 mt-0.4">
                    <Sparkles className="w-3 h-3 text-brand-secondary fill-white" />
                  </div>
                  <span className="leading-relaxed font-bold tracking-tight"><span className="text-brand-dark/30 font-black uppercase text-[9px] block">REWARD</span> {habit.reward}</span>
                </div>
              )}
              {habit.identity_id && (
                <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest flex items-center gap-3 mt-2">
                  <div className="w-6 h-6 rounded-lg bg-brand-dark/5 flex items-center justify-center shrink-0">
                    <Layers className="w-3 h-3 text-brand-dark/60" />
                  </div>
                  <span className="truncate italic">{identities.find(i => i.id === habit.identity_id)?.name || 'Linked Identity'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

