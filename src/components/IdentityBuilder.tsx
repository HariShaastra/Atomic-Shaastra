import React, { useState } from 'react';
import { UserCircle, Plus, Fingerprint, TrendingUp, Share2, Trash2 } from 'lucide-react';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Identity, Habit } from '../types';
import { shareToWhatsApp, getSharingText } from '../lib/sharing';

interface IdentityBuilderProps {
  identities: Identity[];
  habits: Habit[];
}

export default function IdentityBuilder({ identities, habits }: IdentityBuilderProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    try {
      await addDoc(collection(db, 'identities'), {
        name,
        description,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setName('');
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create identity", error);
    }
  };

  const deleteIdentity = async (id: string) => {
    if (!confirm("Destroy this identity anchor? Associated systems will be unlinked.")) return;
    try {
      await deleteDoc(doc(db, 'identities', id));
    } catch (error) {
      console.error("Failed to delete identity", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-1 md:px-0">
        <div>
          <h2 className="text-4xl font-black text-brand-dark tracking-tighter">The Best Me</h2>
          <p className="text-brand-dark/40 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Define who you want to be, then prove it with habits.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => shareToWhatsApp(getSharingText('identity', { name: "my core identities" }))}
            className="btn-secondary flex-1 sm:flex-none justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-5 h-5" /> Add Identity
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card shadow-2xl p-8 border-none ring-1 ring-brand-dark/5 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Identity Statement</label>
              <input 
                required
                type="text" 
                placeholder="e.g., I am a reader"
                className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Purpose / Why</label>
              <textarea 
                placeholder="Why does this matter?"
                className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold min-h-[80px]"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Identity</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {identities.map(identity => {
          const identityHabits = habits.filter(h => h.identity_id === identity.id);
          return (
            <div key={identity.id} className="card group p-8 border-none shadow-2xl shadow-brand-dark/5 bg-white relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] p-12 bg-brand-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-brand-primary/10 rounded-2xl">
                    <Fingerprint className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tight text-brand-dark">{identity.name}</h3>
                    <p className="text-[10px] text-brand-dark/30 uppercase tracking-[0.3em] font-black">Who I am</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => shareToWhatsApp(getSharingText('identity', identity))}
                    className="p-3 text-brand-dark/20 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => identity.id && deleteIdentity(identity.id.toString())}
                    className="p-3 text-brand-dark/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm font-medium text-brand-dark/60 mb-8 italic relative z-10">"{identity.description}"</p>
              
              <div className="space-y-4 pt-6 border-t border-brand-dark/5 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-black text-brand-dark/30 uppercase tracking-widest">
                  <span>Active Habits</span>
                  <span>{identityHabits.length} Small Wins</span>
                </div>
                <div className="space-y-2">
                  {identityHabits.length === 0 ? (
                    <div className="text-[10px] font-bold text-brand-dark/20 uppercase tracking-widest italic">No habits linked yet</div>
                  ) : (
                    identityHabits.map(h => (
                      <div key={h.id} className="flex items-center gap-3 text-xs font-bold text-brand-dark/80">
                        <TrendingUp className="w-3 h-3 text-brand-secondary shrink-0" />
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

