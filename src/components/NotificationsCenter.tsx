import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  Zap, 
  Sparkles, 
  UserCircle, 
  Volume2, 
  VolumeX, 
  Play, 
  Check, 
  CheckCircle2, 
  X, 
  Volume1,
  Coffee,
  Heart,
  Undo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, HabitLog } from '../types';

interface NotificationsCenterProps {
  habits: Habit[];
  logs: HabitLog[];
  toggleHabit: (id: string) => void;
  triggerGlobalBanner: (config: {
    id: string;
    title: string;
    body: string;
    habitName: string;
    habitId: string;
    category: string;
    cue?: string;
    reward?: string;
    identity?: string;
  }) => void;
}

export interface HabitAlertConfig {
  habitId: string;
  enabled: boolean;
  time: string; // "HH:MM"
  style: 'cue' | 'identity' | 'reward' | 'minimal';
}

// Play a beautifully engineered, calm and peaceful bell/chime using high-quality synthesizer synthesis (Web Audio API).
export function playCalmChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tine oscillator
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    // Calm frequency choice: A5 (880Hz) and E5 (659.25Hz) - pure thirds and fifths harmony
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
    
    // Very gentle attack/decay gain profile to build a peaceful, grounded bell sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8); // Decay
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 2.0);
    osc2.stop(ctx.currentTime + 2.0);
  } catch (err) {
    console.warn('Audio context failed to start, this is normal inside iframes until user touch', err);
  }
}

export default function NotificationsCenter({ 
  habits, 
  logs, 
  toggleHabit, 
  triggerGlobalBanner 
}: NotificationsCenterProps) {
  const [configs, setConfigs] = useState<Record<string, HabitAlertConfig>>({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') !== 'false';
  });
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(() => {
    return localStorage.getItem('alertSoundEnabled') !== 'false';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Load configs from local storage
  useEffect(() => {
    const loadedConfigs: Record<string, HabitAlertConfig> = {};
    habits.forEach(habit => {
      const saved = localStorage.getItem(`habit_alert_config_${habit.id}`);
      if (saved) {
        try {
          loadedConfigs[habit.id] = JSON.parse(saved);
        } catch {
          loadedConfigs[habit.id] = getDefaultConfig(habit.id);
        }
      } else {
        loadedConfigs[habit.id] = getDefaultConfig(habit.id);
      }
    });
    setConfigs(loadedConfigs);
  }, [habits]);

  const getDefaultConfig = (habitId: string): HabitAlertConfig => ({
    habitId,
    enabled: true,
    time: '08:00',
    style: 'cue'
  });

  // Save config state
  const saveConfig = (habitId: string, updated: Partial<HabitAlertConfig>) => {
    const current = configs[habitId] || getDefaultConfig(habitId);
    const result = { ...current, ...updated };
    setConfigs(prev => ({ ...prev, [habitId]: result }));
    localStorage.setItem(`habit_alert_config_${habitId}`, JSON.stringify(result));
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          sendBrowserAlert('Reminders Activated', 'Atomic Shaastra will gently nudge you based on your habits.');
        } else {
          alert('Notification permission denied. Please enable reminders in your browser to proceed.');
        }
      } else {
        alert('This browser does not support standard desktop alerts.');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  };

  const toggleSound = () => {
    const newVal = !alertSoundEnabled;
    setAlertSoundEnabled(newVal);
    localStorage.setItem('alertSoundEnabled', newVal.toString());
    if (newVal) playCalmChime();
  };

  const sendBrowserAlert = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  // Generate a non-cringe habit alert message that matches their specific cues/identity definitions
  const generateAlertMessage = (habit: Habit, style: 'cue' | 'identity' | 'reward' | 'minimal') => {
    const defaultCue = habit.cue || "when you have a free moment";
    const defaultReward = habit.reward || "strengthen your momentum";
    const defaultIdentity = habit.identity_name || "your best self";

    switch (style) {
      case 'cue':
        return `Anchor: ${defaultCue}. Ready to practice "${habit.name}"?`;
      case 'identity':
        return `Supporting: "${defaultIdentity}". Small actions reinforce who you are becoming.`;
      case 'reward':
        return `Focus: "${habit.name}" ➔ Reward: ${defaultReward}. Take a brief moment.`;
      default:
        return `Time for your daily practice: "${habit.name}". Simple, calm, and direct.`;
    }
  };

  // Immediate simulated test of notification triggers!
  const handleTestNudge = (habit: Habit) => {
    const config = configs[habit.id] || getDefaultConfig(habit.id);
    const body = generateAlertMessage(habit, config.style);
    
    // Play chime synthesizer
    if (alertSoundEnabled) {
      playCalmChime();
    }

    // Trigger standard browser notification
    if (notificationsEnabled) {
      sendBrowserAlert(`Practice Reminder: ${habit.name}`, body);
    }

    // Trigger high-interaction simulated screen banner
    triggerGlobalBanner({
      id: Math.random().toString(36).substring(7),
      title: `Practice Reminder ⚡`,
      body: body,
      habitName: habit.name,
      habitId: habit.id,
      category: habit.category,
      cue: habit.cue,
      reward: habit.reward,
      identity: habit.identity_name
    });
  };

  const filteredHabits = habits.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (h.category && h.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="card bg-white p-8 md:p-10 border-none shadow-2xl shadow-brand-dark/[0.02] space-y-8 rounded-[2.5rem]">
      {/* Notifications Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-dark/5">
        <div>
          <h3 className="text-xl font-black text-brand-dark tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-primary animate-pulse" /> Alerts & Reminders Hub
          </h3>
          <p className="text-xs font-bold text-brand-dark/30 uppercase tracking-widest mt-1">
            Grounded non-cringe cues based on your personal routines
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Sounds Toggle */}
          <button 
            onClick={toggleSound}
            className={`flex items-center gap-2 p-3 px-4 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all ${
              alertSoundEnabled ? 'bg-amber-500/10 text-amber-600' : 'bg-brand-dark/5 text-brand-dark/40'
            }`}
            title="Toggle Synthesizer Audio Alerts"
          >
            {alertSoundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" /> Sound Synthesized
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" /> Sound Silenced
              </>
            )}
          </button>

          {/* Core Browser Permission Toggles */}
          <button 
            onClick={toggleNotifications}
            className={`flex items-center gap-2 p-3 px-4 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all ${
              notificationsEnabled ? 'bg-brand-dark text-white' : 'bg-brand-dark/5 text-brand-dark/40 hover:bg-brand-dark/10'
            }`}
          >
            {notificationsEnabled ? (
              <>
                <Check className="w-4 h-4 text-brand-accent" /> Desktop Alerts On
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" /> Enable Desktop Alerts
              </>
            )}
          </button>
        </div>
      </div>

      {/* Habits Alerts List Console */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark/40">Schedule Practice Prompts</h4>
          <input
            type="text"
            placeholder="Search habits to configure..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="p-3 bg-brand-dark/5 focus:bg-white rounded-xl text-xs font-bold border-2 border-transparent focus:border-brand-primary outline-none transition-all w-full max-w-xs"
          />
        </div>

        {filteredHabits.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-brand-dark/30 uppercase tracking-widest">
              {searchQuery ? "No matching habits" : "Configure habits in 'Systems' first to set alert timers."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map(habit => {
              const config = configs[habit.id] || getDefaultConfig(habit.id);
              
              return (
                <div 
                  key={habit.id}
                  className={`p-6 border rounded-3xl transition-all flex flex-col justify-between gap-4 ${
                    config.enabled 
                      ? 'bg-slate-50 border-brand-primary/25 shadow-sm shadow-brand-primary/[0.01]' 
                      : 'bg-white border-slate-100 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    {/* Habit Info & Status Indicator */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-brand-primary/15 rounded-lg text-brand-primary">
                          <Zap className="w-3.5 h-3.5" />
                        </span>
                        <h5 className="font-black text-sm text-brand-dark leading-tight">{habit.name}</h5>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 block">
                        Category: {habit.category || 'General'}
                      </span>
                    </div>

                    {/* Enable / Disable Indicator switch */}
                    <button 
                      onClick={() => saveConfig(habit.id, { enabled: !config.enabled })}
                      className={`w-12 h-6.5 rounded-full relative transition-colors ${
                        config.enabled ? 'bg-brand-dark' : 'bg-brand-dark/10'
                      }`}
                    >
                      <span className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full transition-all shadow-md ${
                        config.enabled ? 'left-6.5 bg-brand-accent' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {config.enabled && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-dark/5 bg-white p-4 rounded-2xl relative z-10 transition-all">
                      {/* Reminder Time Setter */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-wider text-brand-dark/30 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> Trigger Time
                        </label>
                        <input 
                          type="time" 
                          value={config.time}
                          onChange={e => saveConfig(habit.id, { time: e.target.value })}
                          className="w-full bg-slate-50 p-2 text-xs font-black rounded-xl outline-none border border-slate-100 focus:border-brand-primary transition-all"
                        />
                      </div>

                      {/* Reminder Style selection */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-wider text-brand-dark/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Notification Nudge
                        </label>
                        <select
                          value={config.style}
                          onChange={e => saveConfig(habit.id, { style: e.target.value as any })}
                          className="w-full bg-slate-50 p-2 text-xs font-black rounded-xl outline-none border border-slate-100 focus:border-brand-primary transition-all"
                        >
                          <option value="cue">Anchored Cue</option>
                          <option value="identity">Identity Anchor</option>
                          <option value="reward">Reward Nudge</option>
                          <option value="minimal">Direct Minimal</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Immediate Test Trigger */}
                  <div className="flex justify-between items-center bg-brand-dark/[0.02] p-3 px-4 rounded-2xl mt-1">
                    <span className="text-[10px] font-bold text-brand-dark/40">
                      {config.enabled ? `Triggers at ${config.time}` : 'Notifications paused'}
                    </span>
                    <button 
                      onClick={() => handleTestNudge(habit)}
                      className="p-2 px-3 bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                      title="Test how this custom nudge sounds and behaves right now"
                    >
                      <Play className="w-3 h-3 fill-current" /> Test Alert
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Why it is non-cringe & Grounded Info */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-brand-dark/5 space-y-4">
        <h5 className="font-black text-xs uppercase tracking-widest text-brand-dark/40 flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-500" /> Non-Addictive Notification Ethos
        </h5>
        <p className="text-xs text-brand-dark/70 font-medium leading-relaxed">
          We believe in respect. Unlike hyper-productive alarms that shame or cause dopamine fatigue:
        </p>
        <ul className="text-[11px] font-semibold text-brand-dark/60 space-y-2 list-disc pl-5">
          <li><strong>No Guilt Tripping:</strong> Alerts will never punish you for misses. A missed day is normal.</li>
          <li><strong>Cue-Based Prompts:</strong> Rather than "Do your task", prompts anchor to your own environment definitions like <em>"{filteredHabits[0]?.cue || 'after sitting down at my desk'}"</em>.</li>
          <li><strong>No Infinite Rings:</strong> Chimes are beautiful, synthesized harmonics that make self-care feel premium and grounded.</li>
        </ul>
      </div>
    </div>
  );
}
