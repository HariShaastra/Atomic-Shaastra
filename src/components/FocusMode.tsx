import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Habit } from '../types';

interface FocusModeProps {
  habits: Habit[];
  focusTime: number;
  breakTime: number;
}

export default function FocusMode({ habits, focusTime, breakTime }: FocusModeProps) {
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
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
      alert(mode === 'focus' ? "Focus session complete! Take a break." : "Break over! Ready to focus?");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

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
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="text-center px-1">
        <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Focus Mode</h2>
        <p className="text-sm md:text-base text-deepblue-900/60 mt-2">Eliminate distractions and focus on a single action.</p>
      </div>

      <div className="card bg-white shadow-xl p-8 md:p-12 flex flex-col items-center space-y-6 md:space-y-8">
        <div className="flex gap-2 md:gap-4 p-1 bg-beige-100 rounded-2xl">
          <button 
            onClick={() => setTimerMode('focus')}
            className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${mode === 'focus' ? 'bg-white shadow-sm text-deepblue-900' : 'text-deepblue-900/40'}`}
          >
            Focus ({focusTime}m)
          </button>
          <button 
            onClick={() => setTimerMode('break')}
            className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${mode === 'break' ? 'bg-white shadow-sm text-deepblue-900' : 'text-deepblue-900/40'}`}
          >
            Short Break ({breakTime}m)
          </button>
        </div>

        <div className="text-6xl md:text-8xl font-bold font-mono text-deepblue-900 tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={toggleTimer}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-deepblue-900 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-deepblue-900/20"
          >
            {isActive ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6 ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-beige-100 text-deepblue-900 flex items-center justify-center hover:bg-beige-200 transition-colors"
          >
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-center text-deepblue-900/40 uppercase tracking-widest text-[10px] md:text-xs">Select a habit to focus on</h3>
        <div className="grid grid-cols-1 gap-3">
          {habits.map(habit => (
            <button
              key={habit.id}
              onClick={() => setSelectedHabit(habit.id)}
              className={`p-3 md:p-4 rounded-2xl border transition-all flex items-center justify-between ${
                selectedHabit === habit.id 
                  ? 'bg-deepblue-900 border-deepblue-900 text-white shadow-lg' 
                  : 'bg-white border-beige-200 hover:border-deepblue-900/20'
              }`}
            >
              <span className="font-bold text-sm md:text-base truncate mr-2">{habit.name}</span>
              {selectedHabit === habit.id && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
