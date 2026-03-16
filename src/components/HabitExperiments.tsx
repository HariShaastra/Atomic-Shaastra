import React, { useState, useEffect } from 'react';
import { FlaskConical, Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Experiment } from '../types';

interface HabitExperimentsProps {
  refresh: () => void;
}

export default function HabitExperiments({ refresh }: HabitExperimentsProps) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration_days: 14,
    start_date: new Date().toISOString().split('T')[0]
  });

  const fetchExperiments = async () => {
    const res = await fetch('/api/experiments');
    const data = await res.json();
    setExperiments(data);
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      setFormData({ name: '', duration_days: 14, start_date: new Date().toISOString().split('T')[0] });
      fetchExperiments();
      refresh();
    } catch (error) {
      console.error("Failed to create experiment", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 md:px-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Habit Experiments</h2>
          <p className="text-sm md:text-base text-deepblue-900/60">Test new routines for a set period to see what works for you.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> New Experiment
        </button>
      </div>

      {showForm && (
        <div className="card bg-white shadow-xl p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Experiment Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g., Wake up at 5 AM, No sugar for 14 days"
                className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Duration (Days)</label>
                <input 
                  required
                  type="number" 
                  className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.duration_days}
                  onChange={e => setFormData({...formData, duration_days: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Start Date</label>
                <input 
                  required
                  type="date" 
                  className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary w-full sm:w-auto">Cancel</button>
              <button type="submit" className="btn-primary w-full sm:w-auto">Start Experiment</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {experiments.map(exp => (
          <div key={exp.id} className="card bg-white border-deepblue-900/5 p-5 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-beige-100 rounded-2xl">
                <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-deepblue-900" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg">{exp.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-deepblue-900/40 uppercase font-bold tracking-widest">
                  <Clock className="w-3 h-3" /> {exp.duration_days} Days
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest">
                <span>Progress</span>
                <span>Active</span>
              </div>
              <div className="h-2 w-full bg-beige-100 rounded-full overflow-hidden">
                <div className="h-full bg-deepblue-900 w-1/4" />
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-deepblue-900/60 italic">
                <Calendar className="w-3 h-3" /> Started on {new Date(exp.start_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
