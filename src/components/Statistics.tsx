import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Calendar, Share2, Target, Zap } from 'lucide-react';
import { Habit, HabitLog, Identity } from '../types';
import { shareToWhatsApp, getSharingText } from '../lib/sharing';

interface StatisticsProps {
  habits: Habit[];
  logs: HabitLog[];
  identities: Identity[];
}

export default function Statistics({ habits, logs, identities }: StatisticsProps) {
  const totalCompletions = logs.length;
  const habitCount = habits.length;

  // Calculate completion rate for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyStats = last7Days.map(date => {
    const dayLogs = logs.filter(l => l.completed_at === date).length;
    return { date, count: dayLogs };
  });

  const maxDaily = Math.max(...dailyStats.map(s => s.count), 1);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-start px-1 md:px-0">
        <div>
          <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Insights</h2>
          <p className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.4em] mt-3">Metrical analysis of your behavioral systems.</p>
        </div>
        <button 
          onClick={() => shareToWhatsApp(getSharingText('stats', { name: "my audit" }))}
          className="btn-secondary"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white p-8 border-none shadow-2xl shadow-brand-dark/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-4">
            <CheckCircle2 className="w-4 h-4 text-brand-primary" /> Volume
          </div>
          <div className="text-5xl font-black text-brand-dark tracking-tighter">{totalCompletions}</div>
          <div className="text-[9px] text-brand-dark/20 mt-1 font-bold uppercase tracking-widest">Total Repetitions</div>
        </div>
        <div className="card bg-white p-8 border-none shadow-2xl shadow-brand-dark/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-4">
            <Zap className="w-4 h-4 text-brand-secondary" /> Scope
          </div>
          <div className="text-5xl font-black text-brand-dark tracking-tighter">{habitCount}</div>
          <div className="text-[9px] text-brand-dark/20 mt-1 font-bold uppercase tracking-widest">Active Systems</div>
        </div>
        <div className="card bg-white p-8 border-none shadow-2xl shadow-brand-dark/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-4">
            <Target className="w-4 h-4 text-brand-accent" /> Roots
          </div>
          <div className="text-5xl font-black text-brand-dark tracking-tighter">{identities.length}</div>
          <div className="text-[9px] text-brand-dark/20 mt-1 font-bold uppercase tracking-widest">Identity Anchors</div>
        </div>
        <div className="card bg-brand-dark text-white p-8 border-none shadow-2xl">
          <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">
            <Calendar className="w-4 h-4 text-brand-primary" /> Efficiency
          </div>
          <div className="text-5xl font-black text-white tracking-tighter">
            {habitCount > 0 ? Math.round((totalCompletions / (habitCount * 30)) * 100) : 0}%
          </div>
          <div className="text-[9px] text-white/20 mt-1 font-bold uppercase tracking-widest">30-Day Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-white p-12 border-none shadow-2xl shadow-brand-dark/5 ring-1 ring-brand-dark/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/30 mb-8 flex items-center gap-3">
              <BarChart3 className="w-5 h-5" /> Velocity (7D)
            </h3>
            <div className="flex items-end justify-between h-48 gap-4 overflow-x-auto pb-4">
              {dailyStats.map(stat => (
                <div key={stat.date} className="flex-1 min-w-[50px] flex flex-col items-center gap-4 group">
                  <div 
                    className="w-full bg-brand-primary rounded-2xl transition-all duration-700 hover:scale-x-110 shadow-lg shadow-brand-primary/10"
                    style={{ height: `${(stat.count / maxDaily) * 100}%`, minHeight: stat.count > 0 ? '8px' : '2px' }}
                  />
                  <div className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest group-hover:text-brand-primary transition-colors">
                    {new Date(stat.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-slate-50 border-none p-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/30 mb-8">System Stability</h3>
            <div className="space-y-8">
              {habits.map(habit => {
                const habitLogs = logs.filter(l => l.habit_id === habit.id).length;
                const progress = Math.min((habitLogs / 30) * 100, 100);
                return (
                  <div key={habit.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm tracking-tight text-brand-dark truncate pr-4">{habit.name}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-dark/30 shrink-0">{habitLogs} Units</span>
                    </div>
                    <div className="xp-bar-container h-2 bg-white">
                      <div 
                        className="xp-bar-fill h-full bg-brand-secondary" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {habits.length === 0 && (
                <div className="text-center py-10 text-[9px] font-black text-brand-dark/20 uppercase tracking-widest italic">
                  No data streams active
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

