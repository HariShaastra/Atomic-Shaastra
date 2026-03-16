import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  UserCircle, 
  FlaskConical, 
  BarChart3, 
  Timer, 
  Settings as SettingsIcon,
  Plus,
  ChevronRight,
  Calendar,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, HabitLog, Identity, Reflection, Experiment, UserProfile } from './types';

// Components
import Dashboard from './components/Dashboard';
import HabitList from './components/HabitList';
import IdentityBuilder from './components/IdentityBuilder';
import ReflectionJournal from './components/ReflectionJournal';
import HabitExperiments from './components/HabitExperiments';
import Statistics from './components/Statistics';
import FocusMode from './components/FocusMode';
import Settings from './components/Settings';
import DailyTracker from './components/DailyTracker';
import Guide from './components/Guide';

type Section = 'dashboard' | 'habits' | 'tracker' | 'streaks' | 'reflection' | 'identity' | 'experiments' | 'stats' | 'focus' | 'settings' | 'guide';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: '', email: '', focusTime: 25, breakTime: 5 };
  });

  const updateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  // Notification Logic
  useEffect(() => {
    const checkNotifications = () => {
      const enabled = localStorage.getItem('notificationsEnabled') === 'true';
      if (!enabled || Notification.permission !== 'granted') return;

      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs.filter(l => l.completed_at === today);
      const pendingCount = habits.length - todayLogs.length;

      if (pendingCount > 0) {
        new Notification('Atomic Shaastra Reminder', {
          body: `You have ${pendingCount} habits left to complete today. Keep up the momentum!`,
          icon: '/favicon.ico'
        });
      }
    };

    // Check once on load after data is fetched
    if (!loading && habits.length > 0) {
      const lastCheck = localStorage.getItem('lastNotificationCheck');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastCheck !== today) {
        checkNotifications();
        localStorage.setItem('lastNotificationCheck', today);
      }
    }
  }, [loading, habits, logs]);

  const fetchData = async () => {
    try {
      const [habitsRes, logsRes, identitiesRes] = await Promise.all([
        fetch('/api/habits'),
        fetch('/api/habit-logs'),
        fetch('/api/identities')
      ]);
      
      const habitsData = await habitsRes.json();
      const logsData = await logsRes.json();
      const identitiesData = await identitiesRes.json();

      setHabits(habitsData);
      setLogs(logsData);
      setIdentities(identitiesData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleHabit = async (habitId: number, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    try {
      const res = await fetch('/api/habit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habit_id: habitId, completed_at: targetDate })
      });
      const result = await res.json();
      
      if (result.status === 'added') {
        setLogs([...logs, { id: result.id, habit_id: habitId, completed_at: targetDate }]);
      } else {
        setLogs(logs.filter(l => !(l.habit_id === habitId && l.completed_at === targetDate)));
      }
    } catch (error) {
      console.error("Failed to toggle habit", error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Daily Tracker', icon: Calendar },
    { id: 'habits', label: 'Habits', icon: CheckCircle2 },
    { id: 'identity', label: 'Identity', icon: UserCircle },
    { id: 'reflection', label: 'Reflection', icon: BookOpen },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'guide', label: 'Atomic Guide', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50">
        <div className="text-deepblue-900 animate-pulse font-medium">Atomic Shaastra...</div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <h1 className="text-xl font-bold tracking-tight text-deepblue-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          Atomic Shaastra
        </h1>
        <p className="text-xs text-deepblue-900/50 mt-1 uppercase tracking-widest font-semibold">Self-Improvement</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id as Section);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === item.id 
                ? 'bg-deepblue-900 text-white shadow-lg shadow-deepblue-900/20' 
                : 'text-deepblue-900/60 hover:bg-beige-100 hover:text-deepblue-900'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-beige-200">
        <div className="bg-beige-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-deepblue-900">Daily Streak</span>
          </div>
          <div className="text-2xl font-bold text-deepblue-900">5 Days</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-beige-50">
      {/* Welcome Modal */}
      <AnimatePresence>
        {!userProfile.name && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deepblue-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-deepblue-900">Welcome to Atomic Shaastra</h2>
                <p className="text-deepblue-900/60">Let's personalize your journey to a better identity.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-deepblue-900/40">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-beige-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-deepblue-900/10 outline-none"
                    placeholder="e.g. James Clear"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) updateProfile({ ...userProfile, name: val });
                      }
                    }}
                  />
                </div>
                <button 
                  onClick={(e) => {
                    const input = (e.currentTarget.previousSibling?.lastChild as HTMLInputElement);
                    if (input.value) updateProfile({ ...userProfile, name: input.value });
                  }}
                  className="w-full btn-primary py-3 rounded-xl font-bold"
                >
                  Start My Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-beige-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-deepblue-900">Atomic Shaastra</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-deepblue-900 hover:bg-beige-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-beige-200 flex flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            {activeSection === 'dashboard' && (
              <Dashboard 
                habits={habits} 
                logs={logs} 
                toggleHabit={toggleHabit} 
                onNavigate={setActiveSection}
                userName={userProfile.name}
              />
            )}
            {activeSection === 'habits' && (
              <HabitList 
                habits={habits} 
                identities={identities} 
                refresh={fetchData} 
              />
            )}
            {activeSection === 'tracker' && (
              <DailyTracker 
                habits={habits} 
                logs={logs} 
                toggleHabit={toggleHabit} 
              />
            )}
            {activeSection === 'identity' && (
              <IdentityBuilder 
                identities={identities} 
                habits={habits}
                refresh={fetchData} 
              />
            )}
            {activeSection === 'reflection' && (
              <ReflectionJournal refresh={fetchData} />
            )}
            {activeSection === 'experiments' && (
              <HabitExperiments refresh={fetchData} />
            )}
            {activeSection === 'stats' && (
              <Statistics habits={habits} logs={logs} />
            )}
            {activeSection === 'focus' && (
              <FocusMode 
                habits={habits} 
                focusTime={userProfile.focusTime}
                breakTime={userProfile.breakTime}
              />
            )}
            {activeSection === 'settings' && (
              <Settings 
                profile={userProfile}
                updateProfile={updateProfile}
              />
            )}
            {activeSection === 'guide' && (
              <Guide />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav (Optional, but good for UX) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-beige-200 px-2 py-1 flex justify-around items-center z-40">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as Section)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              activeSection === item.id ? 'text-deepblue-900' : 'text-deepblue-900/40'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </button>
        ))}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-2 text-deepblue-900/40"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">More</span>
        </button>
      </nav>
      
      {/* Add padding to main content on mobile to account for bottom nav */}
      <div className="lg:hidden h-16" />
    </div>
  );
}
