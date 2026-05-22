import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Timer, Info, Save, LogOut, Share2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';
import { shareToWhatsApp } from '../lib/sharing';

interface SettingsProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

export default function Settings({ profile, updateProfile }: SettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });

  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        } else {
          alert('Notification permission denied. Please enable it in your browser settings.');
        }
      } else {
        alert('This browser does not support desktop notifications.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Atomic Shaastra', {
        body: 'Boom! Reminders are active. Ready to crush your habits?',
        icon: '/favicon.ico'
      });
    }
  };

  const handleSave = () => {
    updateProfile(localProfile);
    alert('Systems refreshed successfully!');
  };

  const handleLogout = () => {
    if (confirm("Sign out of the Shaastra? Your progress is synced and safe.")) {
      auth.signOut();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 md:space-y-12 pb-32">
      <div className="px-1 md:px-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tight">Settings</h2>
          <p className="text-lg font-medium text-brand-dark/50 italic mt-2">Adjust your environment for peak performance.</p>
        </div>
        <button 
          onClick={handleSave}
          className="btn-primary w-full sm:w-auto shadow-2xl"
        >
          <Save className="w-5 h-5 mr-2" />
          Sync Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* User Account */}
        <section className="card space-y-6">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary/10 rounded-2xl group-hover:rotate-12 transition-transform">
                <User className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-black text-brand-dark">Athlete Profile</h3>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all"
            >
              <LogOut className="w-3 h-3 inline mr-1" /> Sign Out
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Identity Name</label>
              <input 
                type="text" 
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                className="w-full bg-brand-dark/5 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl px-5 py-3 text-sm font-bold outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Primary Email</label>
              <input 
                type="email" 
                value={localProfile.email}
                onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                className="w-full bg-brand-dark/5 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl px-5 py-3 text-sm font-bold outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </section>

        {/* Timer Config */}
        <section className="card space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-secondary/10 rounded-2xl">
              <Timer className="w-6 h-6 text-brand-secondary" />
            </div>
            <h3 className="text-xl font-black text-brand-dark">Timer System</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Focus Flow (min)</label>
              <input 
                type="number" 
                value={localProfile.focusTime}
                onChange={(e) => setLocalProfile({ ...localProfile, focusTime: parseInt(e.target.value) || 25 })}
                className="w-full bg-brand-dark/5 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl px-5 py-3 text-sm font-bold outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-1">Recovery (min)</label>
              <input 
                type="number" 
                value={localProfile.breakTime}
                onChange={(e) => setLocalProfile({ ...localProfile, breakTime: parseInt(e.target.value) || 5 })}
                className="w-full bg-brand-dark/5 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl px-5 py-3 text-sm font-bold outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Notifications & Sharing */}
        <div className="grid grid-cols-1 gap-6">
          <div className="card flex items-center justify-between p-6">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-brand-dark/5 rounded-2xl">
                <Bell className="w-6 h-6 text-brand-dark" />
              </div>
              <div>
                <h3 className="font-black text-lg">System Alerts</h3>
                <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest">Notification Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {notificationsEnabled && (
                <button 
                  onClick={sendTestNotification}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary hover:scale-110 transition-transform"
                >
                  Test
                </button>
              )}
              <div 
                onClick={toggleNotifications}
                className={`w-14 h-7 rounded-full relative cursor-pointer transition-all ${notificationsEnabled ? 'bg-brand-dark' : 'bg-brand-dark/10'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all ${notificationsEnabled ? 'left-8 bg-brand-accent' : 'left-1'}`} />
              </div>
            </div>
          </div>

          <button 
             onClick={() => shareToWhatsApp("Check out Atomic Shaastra - the ultimate habit tracking system! Change your identity, change your life. ⚡")}
             className="card flex items-center justify-between p-6 hover:bg-emerald-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 bg-emerald-100 rounded-2xl group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-lg group-hover:text-emerald-700 transition-colors">Spread the Word</h3>
                <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest">Share on WhatsApp</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-brand-dark/20 group-hover:text-emerald-600 transition-all" />
          </button>
        </div>

        <div className="card bg-brand-dark/5 border-none p-10 flex flex-col items-center text-center space-y-6">
          <Info className="w-10 h-10 text-brand-dark/10" />
          <div className="space-y-4">
            <h3 className="font-black text-xl">The Shaastra Philosophy</h3>
            <p className="text-sm text-brand-dark/60 font-bold leading-relaxed max-w-sm">
              Atomic Shaastra is built on the belief that environment is stronger than willpower. 
              Levels, XP, and streaks are tools to bridge the gap between effort and reward.
            </p>
          </div>
          <div className="pt-6 border-t border-brand-dark/5 w-full flex justify-between items-center text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.3em]">
            <span>Version 2.0.0</span>
            <span>Est. 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
