import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Timer, Info, Save } from 'lucide-react';
import { UserProfile } from '../types';

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
        body: 'This is a test notification! Your reminders are working.',
        icon: '/favicon.ico'
      });
    }
  };

  const handleSave = () => {
    updateProfile(localProfile);
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="px-1 md:px-0 flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Settings</h2>
          <p className="text-sm md:text-base text-deepblue-900/60">Personalize your experience.</p>
        </div>
        <button 
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 px-6 py-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* User Profile */}
        <section className="card bg-white p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-beige-50 rounded-xl">
              <User className="w-5 h-5 text-deepblue-900" />
            </div>
            <h3 className="font-bold">User Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Full Name</label>
              <input 
                type="text" 
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                className="w-full bg-beige-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-deepblue-900/10 outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Email Address</label>
              <input 
                type="email" 
                value={localProfile.email}
                onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                className="w-full bg-beige-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-deepblue-900/10 outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </section>

        {/* Timer Settings */}
        <section className="card bg-white p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-beige-50 rounded-xl">
              <Timer className="w-5 h-5 text-deepblue-900" />
            </div>
            <h3 className="font-bold">Timer Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Focus Duration (min)</label>
              <input 
                type="number" 
                value={localProfile.focusTime}
                onChange={(e) => setLocalProfile({ ...localProfile, focusTime: parseInt(e.target.value) || 25 })}
                className="w-full bg-beige-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-deepblue-900/10 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Break Duration (min)</label>
              <input 
                type="number" 
                value={localProfile.breakTime}
                onChange={(e) => setLocalProfile({ ...localProfile, breakTime: parseInt(e.target.value) || 5 })}
                className="w-full bg-beige-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-deepblue-900/10 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <div className="card bg-white flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-beige-50 rounded-2xl">
              <Bell className="w-5 h-5 text-deepblue-900" />
            </div>
            <div>
              <h3 className="font-bold">Notifications</h3>
              <p className="text-sm text-deepblue-900/60">Daily reminders for your habits.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {notificationsEnabled && (
              <button 
                onClick={sendTestNotification}
                className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-500"
              >
                Test
              </button>
            )}
            <div 
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notificationsEnabled ? 'bg-indigo-600' : 'bg-beige-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </div>
          </div>
        </div>

        <div className="card bg-white flex items-center gap-4 p-6">
          <div className="p-3 bg-beige-50 rounded-2xl">
            <Shield className="w-5 h-5 text-deepblue-900" />
          </div>
          <div>
            <h3 className="font-bold">Data Privacy</h3>
            <p className="text-sm text-deepblue-900/60">Your data is stored locally in your browser.</p>
          </div>
        </div>

        <div className="card bg-beige-100 border-none p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white rounded-2xl">
              <Info className="w-5 h-5 text-deepblue-900" />
            </div>
            <h3 className="font-bold">About Atomic Shaastra</h3>
          </div>
          <p className="text-sm text-deepblue-900/70 leading-relaxed">
            Atomic Shaastra is built on the philosophy that small, consistent actions lead to remarkable results. 
            By focusing on identity-based habits and designing your environment for success, you can achieve long-term personal growth.
          </p>
          <div className="mt-6 pt-6 border-t border-white/40 text-[10px] font-bold text-deepblue-900/40 uppercase tracking-widest">
            Version 1.1.0 • Inspired by James Clear
          </div>
        </div>
      </div>
    </div>
  );
}
