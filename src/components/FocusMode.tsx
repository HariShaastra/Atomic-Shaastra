import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Habit } from '../types';

interface FocusModeProps {
  habits: Habit[];
  focusTime: number;
  breakTime: number;
  onComplete: () => void;
}

export default function FocusMode({ habits, focusTime, breakTime, onComplete }: FocusModeProps) {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    setTimeLeft(mode === 'focus' ? focusTime * 60 : breakTime * 60);
  }, [focusTime, breakTime, mode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? focusTime * 60 : breakTime * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const setTimerMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusTime * 60 : breakTime * 60);
    setIsActive(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32">
      <div className="text-center px-1">
        <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Focus</h2>
        <p className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.4em] mt-3">Single-tasking is your competitive edge.</p>
      </div>

      <div className="card shadow-2xl p-12 md:p-20 flex flex-col items-center space-y-12 border-none ring-1 ring-brand-dark/5 bg-white">
        <div className="flex gap-2 p-1.5 bg-brand-dark/5 rounded-3xl">
          <button 
            onClick={() => setTimerMode('focus')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'focus' ? 'bg-white shadow-xl text-brand-dark' : 'text-brand-dark/40'}`}
          >
            Work
          </button>
          <button 
            onClick={() => setTimerMode('break')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'break' ? 'bg-white shadow-xl text-brand-dark' : 'text-brand-dark/40'}`}
          >
            Rest
          </button>
        </div>

        <div className="text-8xl md:text-9xl font-black text-brand-dark tracking-tighter tabular-nums">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-6">
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-dark transition-all shadow-2xl shadow-brand-primary/40 group active:scale-95"
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-100 text-brand-dark flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-center text-brand-dark/30 uppercase tracking-[0.3em]">Target System</h3>
        <div className="grid grid-cols-1 gap-3">
          {habits.map(habit => (
            <button
              key={habit.id}
              onClick={() => setSelectedHabit(habit.id)}
              className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${
                selectedHabit === habit.id 
                  ? 'bg-brand-dark border-brand-dark text-white shadow-2xl scale-[1.02]' 
                  : 'bg-white border-brand-dark/5 hover:border-brand-primary/20 text-brand-dark/60'
              }`}
            >
              <span className="font-black text-lg tracking-tight truncate mr-4">{habit.name}</span>
              {selectedHabit === habit.id && <CheckCircle2 className="w-6 h-6 text-brand-accent" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
