import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import { Habit, HabitLog } from '../types';

interface StatisticsProps {
  habits: Habit[];
  logs: HabitLog[];
}

export default function Statistics({ habits, logs }: StatisticsProps) {
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
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="px-1 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Statistics</h2>
        <p className="text-sm md:text-base text-deepblue-900/60">Visualize your progress and consistency.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="card bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest mb-2">
            <CheckCircle2 className="w-3 h-3" /> Total Completions
          </div>
          <div className="text-3xl md:text-4xl font-bold text-deepblue-900">{totalCompletions}</div>
        </div>
        <div className="card bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest mb-2">
            <TrendingUp className="w-3 h-3" /> Active Habits
          </div>
          <div className="text-3xl md:text-4xl font-bold text-deepblue-900">{habitCount}</div>
        </div>
        <div className="card bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest mb-2">
            <Calendar className="w-3 h-3" /> Success Rate
          </div>
          <div className="text-3xl md:text-4xl font-bold text-deepblue-900">
            {habitCount > 0 ? Math.round((totalCompletions / (habitCount * 30)) * 100) : 0}%
          </div>
          <div className="text-[10px] text-deepblue-900/40 mt-1 uppercase font-bold tracking-widest">Estimated Monthly</div>
        </div>
      </div>

      <div className="card bg-white p-5 md:p-6">
        <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Weekly Consistency
        </h3>
        <div className="flex items-end justify-between h-48 gap-1 md:gap-2 overflow-x-auto pb-2">
          {dailyStats.map(stat => (
            <div key={stat.date} className="flex-1 min-w-[40px] flex flex-col items-center gap-2">
              <div 
                className="w-full bg-deepblue-900 rounded-t-lg transition-all duration-500"
                style={{ height: `${(stat.count / maxDaily) * 100}%`, minHeight: stat.count > 0 ? '4px' : '0' }}
              />
              <div className="text-[8px] md:text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest">
                {new Date(stat.date).toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-beige-100 border-none p-5 md:p-6">
        <h3 className="font-bold mb-4 text-sm md:text-base">Habit Breakdown</h3>
        <div className="space-y-4">
          {habits.map(habit => {
            const habitLogs = logs.filter(l => l.habit_id === habit.id).length;
            return (
              <div key={habit.id} className="space-y-1">
                <div className="flex justify-between text-xs md:text-sm font-medium">
                  <span className="truncate mr-2">{habit.name}</span>
                  <span className="text-deepblue-900/60 shrink-0">{habitLogs} completions</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-deepblue-900" 
                    style={{ width: `${Math.min((habitLogs / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
