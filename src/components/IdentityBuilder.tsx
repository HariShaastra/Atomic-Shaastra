import React, { useState } from 'react';
import { UserCircle, Plus, Fingerprint, TrendingUp } from 'lucide-react';
import { Identity, Habit } from '../types';

interface IdentityBuilderProps {
  identities: Identity[];
  habits: Habit[];
  refresh: () => void;
}

export default function IdentityBuilder({ identities, habits, refresh }: IdentityBuilderProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/identities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      setName('');
      setDescription('');
      setShowForm(false);
      refresh();
    } catch (error) {
      console.error("Failed to create identity", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 md:px-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Identity Builder</h2>
          <p className="text-sm md:text-base text-deepblue-900/60">"The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become."</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> New Identity
        </button>
      </div>

      {showForm && (
        <div className="card bg-white shadow-xl p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Identity Statement</label>
              <input 
                required
                type="text" 
                placeholder="e.g., I am a reader, I am a healthy person"
                className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Description</label>
              <textarea 
                placeholder="Why is this identity important to you?"
                className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 min-h-[100px] text-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary w-full sm:w-auto">Cancel</button>
              <button type="submit" className="btn-primary w-full sm:w-auto">Save Identity</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {identities.map(identity => {
          const identityHabits = habits.filter(h => h.identity_id === identity.id);
          return (
            <div key={identity.id} className="card bg-white flex flex-col p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-beige-100 rounded-2xl">
                  <Fingerprint className="w-5 h-5 md:w-6 md:h-6 text-deepblue-900" />
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl">{identity.name}</h3>
                  <p className="text-[10px] text-deepblue-900/40 uppercase tracking-widest font-bold">Identity</p>
                </div>
              </div>
              
              <p className="text-sm text-deepblue-900/60 mb-6 flex-1 italic">"{identity.description}"</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest">
                  <span>Supporting Habits</span>
                  <span>{identityHabits.length} Evidence</span>
                </div>
                <div className="space-y-2">
                  {identityHabits.length === 0 ? (
                    <div className="text-xs text-deepblue-900/30 italic">No habits linked to this identity yet.</div>
                  ) : (
                    identityHabits.map(h => (
                      <div key={h.id} className="flex items-center gap-2 text-sm text-deepblue-900/80">
                        <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{h.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
