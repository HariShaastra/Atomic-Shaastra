import React, { useState } from 'react';
import { FlaskConical, Plus, Calendar, CheckCircle2, Clock, Share2, Trash2 } from 'lucide-react';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Experiment } from '../types';
import { shareToWhatsApp, getSharingText } from '../lib/sharing';

interface HabitExperimentsProps {
  experiments: Experiment[];
}

export default function HabitExperiments({ experiments }: HabitExperimentsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration_days: 14,
    start_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'experiments'), {
        ...formData,
        userId: auth.currentUser.uid,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      setShowForm(false);
      setFormData({ name: '', duration_days: 14, start_date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error("Failed to create experiment", error);
    }
  };

  const deleteExperiment = async (id: string) => {
    if (!confirm("Terminate this clinical trial? All research data will be purged.")) return;
    try {
      await deleteDoc(doc(db, 'experiments', id));
    } catch (error) {
      console.error("Failed to delete experiment", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-1 md:px-0">
        <div>
          <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Lab</h2>
          <p className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.4em] mt-3">Scientific testing for your life systems.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" /> Start Test
        </button>
      </div>

      {showForm && (
        <div className="card shadow-2xl p-8 border-none ring-1 ring-brand-dark/5 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Hypothesis Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g., No caffeine after 2 PM"
                className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Timeframe (Days)</label>
                <input 
                  required
                  type="number" 
                  className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
                  value={formData.duration_days}
                  onChange={e => setFormData({...formData, duration_days: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Launch Date</label>
                <input 
                  required
                  type="date" 
                  className="w-full p-4 bg-brand-dark/5 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Initiate</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1 md:px-0">
        {experiments.map(exp => (
          <div key={exp.id} className="card group p-8 border-none shadow-2xl shadow-brand-dark/5 bg-white relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-brand-primary/5 rounded-2xl group-hover:rotate-6 transition-transform">
                  <FlaskConical className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight text-brand-dark">{exp.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-brand-dark/30 uppercase font-black tracking-widest mt-1">
                    <Clock className="w-3 h-3" /> {exp.duration_days} Day Cycle
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => shareToWhatsApp(getSharingText('experiment', exp))}
                  className="p-3 text-brand-dark/20 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => exp.id && deleteExperiment(exp.id)}
                  className="p-3 text-brand-dark/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between text-[10px] font-black text-brand-dark/30 uppercase tracking-widest">
                <span>Phase</span>
                <span className="text-brand-secondary font-black">Data Collection</span>
              </div>
              <div className="xp-bar-container bg-slate-100">
                <div className="xp-bar-fill w-1/4 bg-brand-primary shadow-lg shadow-brand-primary/20" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest bg-brand-dark/5 w-fit px-3 py-1.5 rounded-xl">
                <Calendar className="w-3 h-3" /> Started {new Date(exp.start_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {experiments.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <h3 className="text-xl font-black text-brand-dark/20 tracking-tight uppercase tracking-widest">No Active Trials</h3>
          </div>
        )}
      </div>
    </div>
  );
}

