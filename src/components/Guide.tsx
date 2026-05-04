import React from 'react';
import { BookOpen, Target, Zap, ShieldAlert, CheckCircle2, Flame, UserCircle, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { shareToWhatsApp, getSharingText } from '../lib/sharing';

export default function Guide() {
  const sections = [
    {
      icon: Target,
      title: "1. Identity First",
      content: "Don't focus on what you want to achieve. Focus on who you wish to become. Every habit completed is a vote for that new person.",
      color: "text-brand-primary"
    },
    {
      icon: Zap,
      title: "2. Small Wins",
      content: "Atomic habits are 1% improvements. They are the compound interest of self-improvement. Just start with 2 minutes.",
      color: "text-amber-500"
    },
    {
      icon: Flame,
      title: "3. Systems > Goals",
      content: "Goals are about the results you want to achieve. Systems are about the processes that lead to those results.",
      color: "text-red-500"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20 px-4">
      <div className="text-center">
        <h2 className="text-5xl font-black text-brand-dark tracking-tighter">The Shaastra</h2>
        <p className="text-xs font-black text-brand-dark/30 uppercase tracking-[0.4em] mt-4">The clinical manual for total evolution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card bg-white p-10 border-none shadow-2xl shadow-brand-dark/5 group hover:-translate-y-2 transition-all"
          >
            <div className={`p-4 rounded-2xl bg-slate-50 w-fit mb-6 group-hover:bg-brand-primary/10 transition-colors`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <h3 className="font-black text-xl text-brand-dark tracking-tight mb-3">{s.title}</h3>
            <p className="text-sm font-medium text-brand-dark/50 leading-relaxed italic">"{s.content}"</p>
          </motion.div>
        ))}
      </div>

      <div className="card bg-brand-dark text-white p-12 border-none shadow-2xl overflow-hidden relative">
        <div className="absolute right-[-5%] top-[-20%] w-64 h-64 bg-brand-primary opacity-20 blur-[100px] rounded-full" />
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-brand-accent animate-pulse" />
            <h3 className="text-2xl font-black tracking-tight uppercase">Disclaimer & Ethics</h3>
          </div>
          <div className="space-y-4 text-white/60 text-sm font-medium leading-relaxed">
            <p>
              Atomic Shaastra is a behavioral tool for self-optimization. It is not a replacement for professional psychological advice or therapy. 
            </p>
            <p>
              Your data is encrypted and private. We use clinical behavioral science (CBT) principles to help you stay consistent, but your results depend entirely on your effort.
            </p>
            <p>
              By using this app, you acknowledge that habit formation is a gradual process and results may vary based on individual circumstances.
            </p>
          </div>
          <button 
             onClick={() => shareToWhatsApp("Check out Atomic Shaastra for supercharging your productivity! 🚀")}
             className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <Share2 className="w-4 h-4" /> Share with Peers
          </button>
        </div>
      </div>

      <div className="text-center space-y-6">
        <div className="text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.5em]">System Architecture</div>
        <div className="flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           <BookOpen className="w-6 h-6" />
           <CheckCircle2 className="w-6 h-6" />
           <UserCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
