import React from 'react';
import { motion } from 'motion/react';
import { Zap, Sparkles } from 'lucide-react';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center gap-4 ${className}`}>
      <motion.div 
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="absolute inset-0 bg-brand-primary blur-xl opacity-30 rounded-full animate-pulse group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-brand-secondary blur-xl opacity-20 rounded-full animate-pulse translate-x-2 transition-opacity" />
        
        <div className="relative bg-brand-dark p-3.5 rounded-[1.5rem] shadow-2xl border-2 border-white/10 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20"
          />
          <Zap className="w-9 h-9 text-brand-accent fill-brand-accent relative z-10" />
          <motion.div
            animate={{ 
              y: [0, -3, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 z-20"
          >
            <Sparkles className="w-5 h-5 text-brand-secondary fill-brand-secondary" />
          </motion.div>
        </div>
      </motion.div>
      
      <div className="flex flex-col">
        <motion.div 
          className="overflow-hidden"
        >
          <motion.span 
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            className="block text-3xl font-black tracking-tighter text-brand-dark leading-[0.8] italic uppercase"
          >
            ATOMIC
          </motion.span>
        </motion.div>
        <motion.div 
          className="overflow-hidden"
        >
          <motion.span 
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className="block text-3xl font-black tracking-tighter text-brand-primary leading-[0.8] uppercase"
          >
            SHAASTRA
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
