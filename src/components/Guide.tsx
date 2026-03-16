import React from 'react';
import { BookOpen, Zap, Target, Repeat, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Guide() {
  const principles = [
    {
      title: "1st Law: Make it Obvious",
      description: "Design your environment for success. Use implementation intentions: 'I will [BEHAVIOR] at [TIME] in [LOCATION].'",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      title: "2nd Law: Make it Attractive",
      description: "Temptation bundling: Pair an action you want to do with an action you need to do.",
      icon: Target,
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      title: "3rd Law: Make it Easy",
      description: "The Two-Minute Rule: When you start a new habit, it should take less than two minutes to do.",
      icon: Repeat,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "4th Law: Make it Satisfying",
      description: "The cardinal rule of behavior change: What is immediately rewarded is repeated. What is immediately punished is avoided.",
      icon: CheckCircle,
      color: "text-blue-500",
      bg: "bg-blue-50"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-deepblue-900">The Atomic Guide</h2>
        <p className="text-deepblue-900/60 mt-2">Master the systems of behavior change based on Atomic Habits.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {principles.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card bg-white p-6 border-beige-200"
          >
            <div className={`w-12 h-12 ${p.bg} rounded-2xl flex items-center justify-center mb-4`}>
              <p.icon className={`w-6 h-6 ${p.color}`} />
            </div>
            <h3 className="font-bold text-lg text-deepblue-900 mb-2">{p.title}</h3>
            <p className="text-sm text-deepblue-900/60 leading-relaxed">{p.description}</p>
          </motion.div>
        ))}
      </section>

      <section className="card bg-deepblue-900 text-white p-8 border-none shadow-xl shadow-deepblue-900/20">
        <h3 className="text-xl font-bold mb-4">How to use Atomic Shaastra</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <h4 className="font-bold mb-1">Define Your Identity</h4>
              <p className="text-sm opacity-70">Go to the 'Identity' section. Don't just track habits; decide who you want to be (e.g., 'I am a reader').</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <h4 className="font-bold mb-1">Start Small</h4>
              <p className="text-sm opacity-70">Add habits that support your identity. Use the 'Habits' section to link them to cues and rewards.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <h4 className="font-bold mb-1">Track Daily</h4>
              <p className="text-sm opacity-70">Use the Dashboard for today's wins and the Daily Tracker to see your 30-day momentum.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 font-bold">4</div>
            <div>
              <h4 className="font-bold mb-1">Reflect & Adjust</h4>
              <p className="text-sm opacity-70">Use the Reflection Journal weekly to see what's working and what's not. Environment is stronger than willpower.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pt-10">
        <p className="text-sm text-deepblue-900/40 italic">"You do not rise to the level of your goals. You fall to the level of your systems."</p>
      </div>
    </div>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
