import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Timer,
  Zap,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Habit, HabitLog } from '../types';

import { shareToWhatsApp, getSharingText } from '../lib/sharing';

interface DashboardProps {
  habits: Habit[];
  logs: HabitLog[];
  toggleHabit: (id: string) => void;
  onNavigate: (section: any) => void;
  userName?: string;
}

export default function Dashboard({ habits, logs, toggleHabit, onNavigate, userName }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.completed_at === today);
  
  const completedCount = todayLogs.length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Weekly Consistency Calculation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const weeklyCompletion = last7Days.map(date => {
    const dayLogs = logs.filter(l => l.completed_at === date);
    const dayHabits = habits.length;
    return dayHabits > 0 ? (dayLogs.length / dayHabits) : 0;
  });

  const getDayInitial = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'narrow' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="px-1 md:px-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-dark tracking-tighter">
            Hello, {userName || 'Champ'}
          </h2>
          <p className="text-brand-dark/60 font-medium text-sm mt-3 max-w-md leading-relaxed">
            Atomic Shaastra is a professional productivity ecosystem built to automate success through systematic habits. 
            Transform your actions into a powerful identity using clinical behavioral science.
          </p>
          <p className="text-brand-dark/30 font-bold uppercase text-[9px] tracking-[0.4em] mt-2">
            Environment is stronger than willpower.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('focus')}
          className="btn-primary"
        >
          <Timer className="w-5 h-5" />
          Focus Now
        </button>
      </header>

      {/* Primary Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-2 group overflow-hidden relative border-none bg-white shadow-2xl shadow-brand-primary/5">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.2em] mb-2">Today's Systems</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-brand-dark">{completedCount}</span>
                <span className="text-xl font-bold text-brand-dark/20">/ {totalCount} done</span>
              </div>
            </div>
            <button 
              onClick={() => shareToWhatsApp(getSharingText('habit', { name: "daily systems" }))}
              className="p-4 bg-brand-primary/5 text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="xp-bar-container mt-auto">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="xp-bar-fill"
            />
          </div>
          <div className="flex justify-between mt-4">
            <span className="text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.3em]">Momentum</span>
            <span className="text-sm font-black text-brand-primary">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="card bg-brand-dark text-white border-none flex flex-col justify-between p-8 relative overflow-hidden group">
          <Flame className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-400/10 rotate-12" />
          <div>
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Consistency</h3>
            <div className="text-7xl font-black tracking-tighter">5</div>
          </div>
          <button 
            onClick={() => onNavigate('tracker')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent hover:gap-4 transition-all"
          >
            History <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekly Visual - Simplified */}
      <section className="card">
        <h3 className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.3em] mb-8">Weekly Flow</h3>
        <div className="flex justify-between items-end h-32 gap-4">
          {weeklyCompletion.map((ratio, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-slate-50 rounded-2xl relative group overflow-hidden border border-slate-100" style={{ height: '100px' }}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${ratio * 100}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-brand-primary opacity-80 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${last7Days[i] === today ? 'text-brand-primary' : 'text-brand-dark/20'}`}>
                {getDayInitial(last7Days[i])}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Clear List of Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.2em] px-1">Active Habits</h3>
          <div className="space-y-3">
            {habits.slice(0, 4).map(habit => {
              const isCompleted = todayLogs.some(l => l.habit_id === habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all group ${
                    isCompleted 
                      ? 'bg-slate-50 border-transparent opacity-60' 
                      : 'bg-white border-slate-100 hover:border-brand-primary shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-emerald-100 shrink-0' : 'bg-slate-100 shrink-0 group-hover:bg-brand-primary/10'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-slate-300 group-hover:text-brand-primary" />}
                    </div>
                    <div className="text-left truncate">
                      <div className={`font-black tracking-tight truncate ${isCompleted ? 'line-through text-slate-400' : 'text-brand-dark'}`}>
                        {habit.name}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{habit.daily_target}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Small Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <button 
            onClick={() => onNavigate('habits')}
            className="card bg-brand-primary text-white border-none p-8 flex flex-col justify-between group hover:rotate-1 transition-transform"
          >
            <div className="p-3 bg-white/20 rounded-2xl w-fit mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl mb-1 tracking-tight">Systems</h3>
              <p className="text-xs font-bold text-white/60 tracking-widest uppercase">Edit Routines</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('reflection')}
            className="card flex items-center justify-between p-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <BookOpen className="w-5 h-5 text-brand-dark" />
              </div>
              <h3 className="font-black text-brand-dark">Daily Log</h3>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
