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
  level?: number;
  xp?: number;
}

export default function Dashboard({ habits, logs, toggleHabit, onNavigate, userName, level, xp }: DashboardProps) {
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
            Building better habits is the secret to becoming your best self. 
            Start small, stay consistent, and watch your life transform.
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

      {habits.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="card p-10 bg-brand-primary text-white border-none shadow-2xl shadow-brand-primary/20 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-3xl font-black tracking-tight mb-4">Start your first habit</h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed mb-10 max-w-sm">
                Success starts with a single step. Pick something simple like drinking water, reading 1 page, or stretching for 2 minutes.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('habits')}
              className="bg-white text-brand-primary font-black py-5 px-10 rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all w-fit shadow-xl shadow-brand-primary/20 relative z-10"
            >
              Set my first habit
            </button>
          </div>

          <div className="card p-10 bg-brand-dark text-white border-none shadow-2xl flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-3xl font-black tracking-tight mb-4">The new you</h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed mb-10 max-w-sm">
                Define the person you want to become. "I am a healthy person" or "I am a learner". Then prove it with your actions.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('identity')}
              className="bg-brand-primary text-white font-black py-5 px-10 rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all w-fit relative z-10"
            >
              Define "The Best Me"
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Primary Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Progress Card */}
            <div className="card group overflow-hidden relative border-none bg-white shadow-2xl shadow-brand-primary/5 flex flex-col justify-between p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.2em] mb-2">Today's Progress</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-brand-dark">{completedCount}</span>
                    <span className="text-lg font-bold text-brand-dark/20">/ {totalCount} done</span>
                  </div>
                </div>
                <button 
                  onClick={() => shareToWhatsApp(getSharingText('habit', { name: "daily progress" }))}
                  className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="xp-bar-container bg-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="xp-bar-fill"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.3em]">
                  <span>Momentum</span>
                  <span className="text-brand-primary">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Current Streak Card */}
            <div className="card bg-brand-dark text-white border-none flex flex-col justify-between p-8 relative overflow-hidden group">
              <Flame className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-400/10 rotate-12" />
              <div>
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Current Streak</h3>
                <div className="text-6xl font-black tracking-tighter">5</div>
              </div>
              <button 
                onClick={() => onNavigate('tracker')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent hover:gap-4 transition-all"
              >
                Log History <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Growth Card (moved from sidebar) */}
            <div className="card bg-slate-50 border border-brand-dark/5 p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-brand-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              <div>
                <h3 className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.3em] mb-4">Self-Cultivation</h3>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-5xl font-black text-brand-dark tracking-tighter">LVL {level || 1}</span>
                  <span className="text-xs font-bold text-brand-primary">{(xp || 0)} / {(level || 1) * 100} XP</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="xp-bar-container h-3 bg-white border border-brand-dark/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((xp || 0) / ((level || 1) * 100)) * 100}%` }}
                    className="xp-bar-fill shadow-lg shadow-brand-primary/20" 
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] font-black text-brand-dark/30 uppercase tracking-widest leading-none">
                  <span>Growth Journey</span>
                  <span>Keep practicing</span>
                </div>
              </div>
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
              <h3 className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.2em] px-1">My Habits</h3>
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
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal: {habit.daily_target}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Simple Habit Wisdom & Navigation Cards */}
            <div className="space-y-6">
              {/* Compassionate Practice Wisdom */}
              <div className="card bg-slate-50 border border-brand-dark/5 p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-black text-brand-dark/40 uppercase tracking-[0.2em] mb-1">Simple Wisdom</h3>
                  <h4 className="font-black text-lg text-brand-dark tracking-tight">Build routines peacefully</h4>
                </div>
                
                <ul className="space-y-4 text-xs font-medium text-brand-dark/70">
                  <li className="flex gap-3">
                    <span className="text-brand-primary font-black shrink-0">1.</span>
                    <span><strong className="text-brand-dark">Start absurdly tiny</strong> — Drink one glass of water, read one page, or stretch for 2 minutes. Build consistency before intensity.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-black shrink-0">2.</span>
                    <span><strong className="text-brand-dark">Design your space</strong> — Keep your books visible or place a water bottle right next to your computer. Action flows from your environment.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-secondary font-black shrink-0">3.</span>
                    <span><strong className="text-brand-dark">Compassionate restart</strong> — Streaks will break, and that is a natural part of growth. Do not feel guilty. Click any habit on the left to wake up your discipline gently today.</span>
                  </li>
                </ul>
              </div>

              {/* Quick Navigation Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => onNavigate('habits')}
                  className="card bg-brand-primary text-white border-none p-6 flex flex-col justify-between group hover:scale-[1.02] active:scale-95 transition-all text-left outline-none shadow-sm"
                >
                  <div className="p-2 bg-white/20 rounded-xl w-fit mb-4">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-0.5 tracking-tight">Edit Habits</h3>
                    <p className="text-[9px] font-bold text-white/60 tracking-widest uppercase">Modify Routines</p>
                  </div>
                </button>

                <button 
                  onClick={() => onNavigate('reflection')}
                  className="card bg-white border border-brand-dark/5 p-6 flex flex-col justify-between group hover:scale-[1.02] active:scale-95 transition-all text-left outline-none shadow-sm shadow-brand-dark/[0.02]"
                >
                  <div className="p-2 bg-slate-100 rounded-xl w-fit mb-4">
                    <BookOpen className="w-4 h-4 text-brand-dark" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-brand-dark mb-0.5 tracking-tight">Reflect Log</h3>
                    <p className="text-[9px] font-bold text-brand-dark/30 tracking-widest uppercase">Write Journal</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
