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
  Info,
  X,
  LogOut,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  onSnapshot,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, loginWithGoogle, logout } from './lib/firebase';
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
import Logo from './components/Logo';

type Section = 'dashboard' | 'habits' | 'tracker' | 'streaks' | 'reflection' | 'identity' | 'experiments' | 'stats' | 'focus' | 'settings' | 'guide';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mascotMessage, setMascotMessage] = useState<string | undefined>("Systems active. Ready for precision?");
  
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: '', 
    email: '', 
    focusTime: 25, 
    breakTime: 5,
    xp: 0,
    level: 1,
    badges: []
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Data Syncing
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Profile sync
    const profileUnsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        // Init profile
        const initialProfile: UserProfile = {
          name: user.displayName || '',
          email: user.email || '',
          focusTime: 25,
          breakTime: 5,
          xp: 0,
          level: 1,
          badges: []
        };
        setDoc(doc(db, 'users', user.uid), initialProfile);
      }
    });

    // Habits sync
    const habitsQuery = query(collection(db, 'habits'), where('userId', '==', user.uid));
    const habitsUnsub = onSnapshot(habitsQuery, (snap) => {
      setHabits(snap.docs.map(d => ({ id: d.id, ...d.data() } as Habit)));
    });

    // Logs sync (last 30 days)
    const logsQuery = query(collection(db, 'logs'), where('userId', '==', user.uid));
    const logsUnsub = onSnapshot(logsQuery, (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as HabitLog)));
    });

    // Identities sync
    const identitiesQuery = query(collection(db, 'identities'), where('userId', '==', user.uid));
    const identitiesUnsub = onSnapshot(identitiesQuery, (snap) => {
      setIdentities(snap.docs.map(d => ({ id: d.id, ...d.data() } as Identity)));
    });

    // Experiments sync
    const experimentsQuery = query(collection(db, 'experiments'), where('userId', '==', user.uid));
    const experimentsUnsub = onSnapshot(experimentsQuery, (snap) => {
      setExperiments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Experiment)));
    });

    // Reflections sync
    const reflectionsQuery = query(collection(db, 'reflections'), where('userId', '==', user.uid));
    const reflectionsUnsub = onSnapshot(reflectionsQuery, (snap) => {
      setReflections(snap.docs.map(d => ({ id: d.id, ...d.data() } as Reflection)));
    });

    setLoading(false);

    return () => {
      profileUnsub();
      habitsUnsub();
      logsUnsub();
      identitiesUnsub();
      experimentsUnsub();
      reflectionsUnsub();
    };
  }, [user]);

  const updateProfile = async (newProfile: UserProfile) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { ...newProfile });
    } catch (e) {
      console.error(e);
    }
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    const newXP = userProfile.xp + amount;
    const nextLevelXP = userProfile.level * 100;
    
    if (newXP >= nextLevelXP) {
      const newLevel = userProfile.level + 1;
      setMascotMessage(`Incredible! You just reached Level ${newLevel}!`);
      await updateProfile({ ...userProfile, xp: newXP - nextLevelXP, level: newLevel });
    } else {
      await updateProfile({ ...userProfile, xp: newXP });
    }
  };

  const toggleHabit = async (habitId: string, date?: string) => {
    if (!user) return;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const existingLog = logs.find(l => l.habit_id === habitId && l.completed_at === targetDate);

    try {
      if (existingLog) {
        await deleteDoc(doc(db, 'logs', existingLog.id as string));
      } else {
        const xpAmount = 10 * userProfile.level;
        addXP(xpAmount);
        setMascotMessage(`Great job! +${xpAmount} XP earned.`);
        await addDoc(collection(db, 'logs'), {
          userId: user.uid,
          habit_id: habitId,
          completed_at: targetDate,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Failed to toggle habit", error);
    }
  };

  useEffect(() => {
    const messages = [
      "Tip: Click a habit on your dashboard to mark it as done!",
      "Tip: Try adding an 'Identity' first. It's who you want to be.",
      "Tip: Keep your first habits very small. Even 2 minutes counts!",
      "Consistency is about showing up. Even on your bad days.",
      "You're doing great! Small steps lead to big change.",
      "Check your 'Progress' tab to see your weekly wins.",
      "Need to focus? Try the 'Focus Now' button at the top.",
      "Remember: Identity follows action. You are what you repeatedly do.",
      "Every checkmark is a vote for your future self."
    ];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // Show more frequently for guidance
        const msg = messages[Math.floor(Math.random() * messages.length)];
        setMascotMessage(msg);
        setTimeout(() => setMascotMessage(undefined), 10000);
      }
    }, 45000); // Check every 45 seconds
    
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'habits', label: 'Systems', icon: Zap },
    { id: 'identity', label: 'Identity', icon: UserCircle },
    { id: 'tracker', label: 'History', icon: Calendar },
    { id: 'stats', label: 'Insights', icon: BarChart3 },
    { id: 'reflection', label: 'Log', icon: BookOpen },
    { id: 'experiments', label: 'Lab', icon: FlaskConical },
    { id: 'guide', label: 'Guide', icon: Info },
    { id: 'settings', label: 'Config', icon: SettingsIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <Logo className="scale-150 mb-12" />
          <div className="text-brand-dark/20 animate-pulse font-black uppercase tracking-[0.5em] text-xs">Initialising Shaastra...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-50 to-brand-primary/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-12 text-center"
        >
          <Logo className="scale-125 mx-auto" />
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-brand-dark tracking-tighter">Enter the Shaastra</h1>
            <p className="text-brand-dark/40 font-medium leading-relaxed">
              Automate your evolution. Build clinical systems and transform your identity. 
            </p>
          </div>
          
          <div className="p-8 bg-white rounded-[3rem] shadow-2xl shadow-brand-dark/10 border border-brand-dark/5 space-y-6">
            <button 
              onClick={loginWithGoogle}
              className="w-full bg-brand-dark text-white p-5 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Sign in with Google
            </button>
            <p className="text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.2em]">
              Encrypted • Professional • Secure
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="p-8 pb-12">
        <Logo />
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id as Section);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-3xl text-sm font-black transition-all ${
              activeSection === item.id 
                ? 'bg-brand-dark text-white shadow-2xl shadow-brand-dark/20 scale-[1.02]' 
                : 'text-brand-dark/40 hover:bg-brand-dark/5 hover:text-brand-dark/80'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeSection === item.id ? 'bg-brand-primary' : 'bg-brand-dark/5'}`}>
              <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-white' : 'text-brand-dark/40'}`} />
            </div>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-4">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-dark/40 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
        >
          <LogOut className="w-3 h-3" /> Terminate Session
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-brand-dark/5 p-4 flex items-center justify-between sticky top-0 z-50">
        <Logo className="scale-75 origin-left" />
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-brand-dark/5 text-brand-dark rounded-2xl transition-colors active:scale-90"
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
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 bg-white border-r border-brand-dark/5 flex-col sticky top-0 h-screen shadow-2xl shadow-brand-dark/[0.02]">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-16 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-6xl mx-auto"
          >
            {activeSection === 'dashboard' && (
              <Dashboard 
                habits={habits} 
                logs={logs} 
                toggleHabit={toggleHabit} 
                onNavigate={setActiveSection}
                userName={userProfile.name}
                level={userProfile.level}
                xp={userProfile.xp}
              />
            )}
            {activeSection === 'habits' && (
              <HabitList 
                habits={habits} 
                identities={identities} 
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
              />
            )}
            {activeSection === 'reflection' && (
              <ReflectionJournal habits={habits} reflections={reflections} />
            )}
            {activeSection === 'experiments' && (
              <HabitExperiments experiments={experiments} />
            )}
            {activeSection === 'stats' && (
              <Statistics habits={habits} logs={logs} identities={identities} />
            )}
            {activeSection === 'focus' && (
              <FocusMode 
                habits={habits} 
                focusTime={userProfile.focusTime}
                breakTime={userProfile.breakTime}
                onComplete={() => addXP(20 * userProfile.level)}
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

      {/* Footer / Mobile Nav space */}
      <div className="lg:hidden h-24" />
    </div>
  );
}

