import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Timer,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { Habit, HabitLog } from '../types';

interface DashboardProps {
  habits: Habit[];
  logs: HabitLog[];
  toggleHabit: (id: number) => void;
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
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10">
      <header className="px-1 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
          Good Morning, {userName || 'Friend'}
        </h2>
        <p className="text-deepblue-900/60 mt-1 italic text-sm md:text-base">"Every action you take is a vote for the type of person you wish to become."</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="card md:col-span-2 flex flex-col justify-between p-5 md:p-6">
          <div>
            <h3 className="text-lg font-bold mb-1">Today's Progress</h3>
            <p className="text-sm text-deepblue-900/60 mb-4 md:mb-6">{completedCount} of {totalCount} habits completed</p>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="h-3 w-full bg-beige-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-deepblue-900 transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] md:text-xs font-medium text-deepblue-900/40 uppercase tracking-widest">
              {progress === 100 ? 'Identity Strengthened' : 'Keep going, small steps matter'}
            </p>
          </div>
        </div>

        <div className="card bg-deepblue-900 text-white border-none flex flex-row md:flex-col justify-between items-center md:items-start p-5 md:p-6 shadow-lg shadow-deepblue-900/20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start md:w-full">
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
            <span className="hidden md:inline text-xs font-bold opacity-60 uppercase tracking-widest">Streaks</span>
          </div>
          <div className="text-right md:text-left">
            <div className="text-3xl md:text-4xl font-bold mb-0 md:mb-1">5</div>
            <div className="text-[10px] md:text-sm opacity-80 uppercase md:normal-case font-bold md:font-normal tracking-widest md:tracking-normal">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Weekly Consistency Section */}
      <section className="card bg-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Weekly Consistency</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-deepblue-900 rounded-sm"></div>
            <span className="text-[10px] uppercase font-bold text-deepblue-900/40 tracking-widest">Completed</span>
          </div>
        </div>
        <div className="flex justify-between items-end h-32 gap-2">
          {weeklyCompletion.map((ratio, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-beige-50 rounded-t-lg relative group overflow-hidden" style={{ height: '100px' }}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${ratio * 100}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-deepblue-900/80 group-hover:bg-deepblue-900 transition-colors"
                />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${last7Days[i] === today ? 'text-deepblue-900' : 'text-deepblue-900/30'}`}>
                {getDayInitial(last7Days[i])}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1 md:px-0">
            <h3 className="text-lg md:text-xl font-bold">Today's Habits</h3>
            <button onClick={() => onNavigate('habits')} className="text-xs md:text-sm font-medium text-deepblue-900/60 hover:text-deepblue-900 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-beige-200 rounded-2xl text-deepblue-900/40">
                No habits defined yet. Start small.
              </div>
            ) : (
              habits.map(habit => {
                const isCompleted = todayLogs.some(l => l.habit_id === habit.id);
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-full flex items-center justify-between p-3 md:p-4 rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'bg-white/50 border-deepblue-900/10 opacity-60' 
                        : 'bg-white border-beige-200 hover:border-deepblue-900/30 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 md:w-6 md:h-6 text-beige-200" />
                      )}
                      <div className="text-left">
                        <div className={`font-bold text-sm md:text-base ${isCompleted ? 'line-through opacity-50' : ''}`}>
                          {habit.name}
                        </div>
                        <div className="text-[10px] md:text-xs text-deepblue-900/40">{habit.daily_target}</div>
                      </div>
                    </div>
                    {habit.identity_name && (
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest bg-beige-100 px-2 py-1 rounded-md text-deepblue-900/60 truncate max-w-[80px] md:max-w-none">
                        {habit.identity_name}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
          <div className="card bg-beige-100 border-none p-5 md:p-6">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="p-2 bg-white rounded-xl">
                <Timer className="w-4 h-4 md:w-5 md:h-5 text-deepblue-900" />
              </div>
              <h3 className="font-bold text-sm md:text-base">Focus Session</h3>
            </div>
            <p className="text-xs md:text-sm text-deepblue-900/60 mb-4">Deep work is the superpower of the 21st century. Start a timed session.</p>
            <button 
              onClick={() => onNavigate('focus')}
              className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
            >
              Start Focus <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="card bg-white p-5 md:p-6">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="p-2 bg-beige-50 rounded-xl">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-deepblue-900" />
              </div>
              <h3 className="font-bold text-sm md:text-base">Reflection</h3>
            </div>
            <p className="text-xs md:text-sm text-deepblue-900/60 mb-4">How did your systems perform today? Adjust your environment for success.</p>
            <button 
              onClick={() => onNavigate('reflection')}
              className="w-full btn-secondary text-sm"
            >
              Daily Reflection
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
