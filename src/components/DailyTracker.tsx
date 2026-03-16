import React from 'react';
import { Habit, HabitLog } from '../types';
import { Check, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DailyTrackerProps {
  habits: Habit[];
  logs: HabitLog[];
  toggleHabit: (id: number, date: string) => void;
}

export default function DailyTracker({ habits, logs, toggleHabit }: DailyTrackerProps) {
  const today = new Date();
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="max-w-full mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="px-1 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Daily Tracker</h2>
        <p className="text-sm md:text-base text-deepblue-900/60">Visualize your consistency over the past 30 days.</p>
      </div>

      <div className="card bg-white overflow-x-auto p-0 border-beige-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-beige-100">
              <th className="p-4 text-left text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40 sticky left-0 bg-white z-10 min-w-[150px] border-r border-beige-100">Habit</th>
              {dates.map((date, index) => (
                <th key={date} className="p-2 text-center min-w-[45px]">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-deepblue-900/40">Day</span>
                    <span className={`text-xs font-bold mt-1 w-7 h-7 flex items-center justify-center rounded-full ${date === today.toISOString().split('T')[0] ? 'bg-deepblue-900 text-white' : 'text-deepblue-900'}`}>
                      {index + 1}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td colSpan={31} className="p-12 text-center text-deepblue-900/30 italic">
                  No habits defined yet. Go to the Habits section to start.
                </td>
              </tr>
            ) : (
              habits.map(habit => (
                <tr key={habit.id} className="border-b border-beige-50 hover:bg-beige-50/50 transition-colors">
                  <td className="p-4 sticky left-0 bg-white z-10 border-r border-beige-100">
                    <div className="font-bold text-sm text-deepblue-900 truncate max-w-[140px]">{habit.name}</div>
                    <div className="text-[10px] text-deepblue-900/40 uppercase tracking-tight">{habit.category}</div>
                  </td>
                  {dates.map(date => {
                    const isCompleted = logs.some(l => l.habit_id === habit.id && l.completed_at === date);
                    const isToday = date === today.toISOString().split('T')[0];
                    
                    return (
                      <td key={date} className="p-2 text-center">
                        <button
                          onClick={() => toggleHabit(habit.id, date)}
                          className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white shadow-sm' 
                              : isToday 
                                ? 'border-2 border-deepblue-900/20 hover:border-deepblue-900/40' 
                                : 'bg-beige-100 hover:bg-beige-200'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3 h-3" /> : null}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-beige-100 border-none p-6">
          <h3 className="font-bold text-deepblue-900 mb-2">Consistency is Key</h3>
          <p className="text-sm text-deepblue-900/60 leading-relaxed">
            Don't break the chain. If you miss a day, your only goal is to not miss two days in a row. 
            The tracker helps you see the visual evidence of your new identity.
          </p>
        </div>
        <div className="card bg-white p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-deepblue-900">30-Day Completion</h3>
            <p className="text-2xl font-bold text-deepblue-900 mt-1">
              {habits.length > 0 ? Math.round((logs.filter(l => dates.includes(l.completed_at)).length / (habits.length * 30)) * 100) : 0}%
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
