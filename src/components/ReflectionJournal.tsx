import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Calendar } from 'lucide-react';
import { Reflection } from '../types';

interface ReflectionJournalProps {
  refresh: () => void;
}

export default function ReflectionJournal({ refresh }: ReflectionJournalProps) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [formData, setFormData] = useState({
    easiest_habit: '',
    difficult_habit: '',
    consistency_insight: ''
  });

  const fetchReflections = async () => {
    const res = await fetch('/api/reflections');
    const data = await res.json();
    setReflections(data);
  };

  useEffect(() => {
    fetchReflections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    try {
      await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, date: today })
      });
      setFormData({ easiest_habit: '', difficult_habit: '', consistency_insight: '' });
      fetchReflections();
      refresh();
    } catch (error) {
      console.error("Failed to save reflection", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="px-1 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Reflection Journal</h2>
        <p className="text-sm md:text-base text-deepblue-900/60">Review your systems and learn from your behavior.</p>
      </div>

      <div className="card bg-white shadow-xl p-5 md:p-8">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Today's Reflection
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">What habit was easiest today?</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
              value={formData.easiest_habit}
              onChange={e => setFormData({...formData, easiest_habit: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">What habit was difficult?</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 text-sm"
              value={formData.difficult_habit}
              onChange={e => setFormData({...formData, difficult_habit: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">What helped you stay consistent? (or what hindered you?)</label>
            <textarea 
              required
              className="w-full p-3 bg-beige-50 rounded-xl border border-beige-200 focus:outline-none focus:border-deepblue-900 min-h-[100px] text-sm"
              value={formData.consistency_insight}
              onChange={e => setFormData({...formData, consistency_insight: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Save Reflection <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-xl px-1 md:px-0">Past Reflections</h3>
        <div className="space-y-4">
          {reflections.map(ref => (
            <div key={ref.id} className="card bg-white p-5 md:p-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest mb-4">
                <Calendar className="w-3 h-3" /> {new Date(ref.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <div className="text-[10px] font-bold text-deepblue-900/40 uppercase mb-1">Success</div>
                  <p className="text-sm font-medium">{ref.easiest_habit}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-deepblue-900/40 uppercase mb-1">Challenge</div>
                  <p className="text-sm font-medium">{ref.difficult_habit}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-beige-100">
                <div className="text-[10px] font-bold text-deepblue-900/40 uppercase mb-1">Insight</div>
                <p className="text-sm italic text-deepblue-900/70">"{ref.consistency_insight}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
