import React from 'react';
import { Habit, HabitLog } from '../types';
import { Check, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DailyTrackerProps {
  habits: Habit[];
  logs: HabitLog[];
  toggleHabit: (id: string, date: string) => void;
}

export default function DailyTracker({ habits, logs, toggleHabit }: DailyTrackerProps) {
  const today = new Date();
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const getOverallStats = () => {
    if (habits.length === 0) return 0;
    const totalPossibleSlots = habits.length * 30;
    const completedSlots = logs.filter(l => dates.includes(l.completed_at)).length;
    return Math.round((completedSlots / totalPossibleSlots) * 100);
  };

  return (
    <div className="max-w-full mx-auto space-y-12 pb-20">
      <div className="px-1 md:px-0">
        <h2 className="text-4xl font-black text-brand-dark tracking-tighter">History</h2>
        <p className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.4em] mt-3">Visual evidence of your evolution.</p>
      </div>

      <div className="card bg-white overflow-x-auto p-0 border-none shadow-2xl shadow-brand-dark/5 ring-1 ring-brand-dark/5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="p-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/30 sticky left-0 bg-white z-10 min-w-[150px] border-r border-slate-100">System</th>
              {dates.map((date, index) => (
                <th key={date} className="p-2 text-center min-w-[45px]">
                  <div className="flex flex-col items-center">
                    <span className={`text-[10px] font-black mt-1 w-8 h-8 flex items-center justify-center rounded-xl ${date === today.toISOString().split('T')[0] ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-dark/40'}`}>
                      {new Date(date).getDate()}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td colSpan={31} className="p-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/20">
                  No systems online
                </td>
              </tr>
            ) : (
              habits.map(habit => (
                <tr key={habit.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6 sticky left-0 bg-white z-10 border-r border-slate-100">
                    <div className="font-black text-sm text-brand-dark tracking-tight">{habit.name}</div>
                    <div className="text-[9px] font-bold text-brand-dark/20 uppercase tracking-widest">{habit.category}</div>
                  </td>
                  {dates.map(date => {
                    const isCompleted = logs.some(l => l.habit_id === habit.id && l.completed_at === date);
                    const isToday = date === today.toISOString().split('T')[0];
                    
                    return (
                      <td key={date} className="p-2 text-center">
                        <button
                          onClick={() => toggleHabit(habit.id, date)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-110' 
                              : isToday 
                                ? 'border-2 border-brand-primary/20 hover:border-brand-primary/40' 
                                : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : null}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-brand-dark text-white border-none p-10 flex flex-col justify-center">
          <h3 className="font-black text-xl mb-4 tracking-tight">The Unbroken Chain</h3>
          <p className="text-sm font-medium text-white/50 leading-relaxed">
            Never miss twice. If you fail today, ensure tomorrow is a success. This tracker isn't for score, it's for momentum.
          </p>
        </div>
        <div className="card bg-white p-10 flex items-center justify-between shadow-2xl shadow-brand-dark/5">
          <div>
            <h3 className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.2em] mb-2">30-Day Flow</h3>
            <p className="text-5xl font-black text-brand-dark tracking-tighter">
              {habits.length > 0 ? Math.round((logs.filter(l => dates.includes(l.completed_at)).length / (habits.length * 30)) * 100) : 0}%
            </p>
          </div>
          <div className="w-20 h-20 rounded-3xl bg-brand-primary/5 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-brand-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
