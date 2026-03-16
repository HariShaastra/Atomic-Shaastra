import React, { useState } from 'react';
import { Plus, Trash2, Zap, Target, Sparkles, Layers } from 'lucide-react';
import { Habit, Identity } from '../types';

interface HabitListProps {
  habits: Habit[];
  identities: Identity[];
  refresh: () => void;
}

export default function HabitList({ habits, identities, refresh }: HabitListProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          identity_id: formData.identity_id ? parseInt(formData.identity_id) : null,
          stack_after_id: formData.stack_after_id ? parseInt(formData.stack_after_id) : null
        })
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
      refresh();
    } catch (error) {
      console.error("Failed to create habit", error);
    }
  };

  const deleteHabit = async (id: number) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    try {
      await fetch(`/api/habits/${id}`, { method: 'DELETE' });
      refresh();
    } catch (error) {
      console.error("Failed to delete habit", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 md:px-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Habits</h2>
          <p className="text-sm md:text-base text-deepblue-900/60">Design your systems for success.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      {showForm && (
        <div className="card bg-white border-deepblue-900/10 shadow-xl p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Habit Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Read 5 pages"
                  className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Daily Target</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., 5 pages, 10 mins"
                  className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.daily_target}
                  onChange={e => setFormData({...formData, daily_target: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Category</label>
                <select 
                  className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
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
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Difficulty</label>
                <select 
                  className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value as any})}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Identity</label>
                <select 
                  className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.identity_id}
                  onChange={e => setFormData({...formData, identity_id: e.target.value})}
                >
                  <option value="">None</option>
                  {identities.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 bg-beige-50 rounded-2xl border border-beige-200">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Habit Cue (Obvious)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., After my morning coffee..."
                  className="w-full p-3 bg-white rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.cue}
                  onChange={e => setFormData({...formData, cue: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Reward (Satisfying)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Listen to my favorite podcast"
                  className="w-full p-3 bg-white rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.reward}
                  onChange={e => setFormData({...formData, reward: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary w-full sm:w-auto">Cancel</button>
              <button type="submit" className="btn-primary w-full sm:w-auto">Create Habit</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {habits.map(habit => (
          <div key={habit.id} className="card group p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-base md:text-lg truncate">{habit.name}</h3>
                  <span className={`text-[8px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${
                    habit.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                    habit.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {habit.difficulty}
                  </span>
                </div>
                <div className="text-xs md:text-sm text-deepblue-900/60 flex items-center gap-2">
                  <Target className="w-3 h-3" /> {habit.daily_target}
                </div>
              </div>
              <button 
                onClick={() => deleteHabit(habit.id)}
                className="p-2 text-rose-500 lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 rounded-lg shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-beige-100">
              {habit.cue && (
                <div className="text-[10px] md:text-xs text-deepblue-900/60 italic flex items-center gap-2">
                  <Zap className="w-3 h-3 text-amber-500 shrink-0" /> <span className="truncate">Cue: {habit.cue}</span>
                </div>
              )}
              {habit.reward && (
                <div className="text-[10px] md:text-xs text-deepblue-900/60 italic flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" /> <span className="truncate">Reward: {habit.reward}</span>
                </div>
              )}
              {habit.identity_name && (
                <div className="text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3 shrink-0" /> <span className="truncate">Identity: {habit.identity_name}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
