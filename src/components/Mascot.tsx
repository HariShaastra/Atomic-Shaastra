import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';

interface MascotProps {
  message?: string;
  expression?: 'happy' | 'thinking' | 'encouraging';
}

export default function Mascot({ message, expression = 'happy' }: MascotProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 max-w-xs p-4 glass rounded-2xl rounded-br-none shadow-2xl relative pointer-events-auto"
          >
            <p className="text-sm font-bold text-brand-dark leading-relaxed">
              {message}
            </p>
            <div className="absolute bottom-0 right-0 transform translate-y-full border-[10px] border-transparent border-t-white/60" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="w-24 h-24 relative pointer-events-auto cursor-pointer"
        whileHover={{ scale: 1.1 }}
        animate={{ 
          y: [0, -5, 0],
          rotate: expression === 'thinking' ? [0, 5, 0] : 0
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        {/* Simple Mascot SVG - A fox in a suit */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          {/* Professional Mascot: A fox in a sharp suit and glasses */}
          {/* Shadow */}
          <ellipse cx="50" cy="95" rx="30" ry="5" fill="black" opacity="0.1" />
          
          {/* Body/Suit */}
          <path d="M30 70 C30 60 40 55 50 55 C60 55 70 60 70 70 L75 95 L25 95 Z" fill="#0f172a" />
          <path d="M50 55 L35 70 L50 95 L65 70 Z" fill="white" /> {/* Shirt */}
          <path d="M48 55 L52 55 L50 75 Z" fill="#6366f1" /> {/* Silk Tie */}
          
          {/* Head */}
          <path d="M30 45 L50 15 L70 45 L70 65 C70 75 50 85 30 65 Z" fill="#f59e0b" />
          <path d="M40 60 L50 50 L60 60 L60 65 L50 70 L40 65 Z" fill="white" />
          
          {/* Ears */}
          <path d="M32 25 L40 15 L45 28 Z" fill="#f59e0b" />
          <path d="M68 25 L60 15 L55 28 Z" fill="#f59e0b" />
          
          {/* Eyes with Glasses */}
          <rect x="38" y="42" width="10" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="1" />
          <rect x="52" y="42" width="10" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="1" />
          <line x1="48" y1="46" x2="52" y2="46" stroke="#0f172a" strokeWidth="1" />
          
          {/* Pupils */}
          <circle cx="43" cy="46" r="1.5" fill="#0f172a" />
          <circle cx="57" cy="46" r="1.5" fill="#0f172a" />
          
          {/* Expression */}
          {expression === 'happy' && <path d="M45 62 Q50 67 55 62" stroke="#0f172a" strokeWidth="1" fill="none" />}
          {expression === 'encouraging' && <path d="M43 63 Q50 65 57 63" stroke="#0f172a" strokeWidth="1.5" fill="none" />}
          {expression === 'thinking' && <path d="M45 61 Q50 61 55 61" stroke="#0f172a" strokeWidth="1" fill="none" />}
        </svg>
        
        {/* Animated sparkles around mascot */}
        <motion.div
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="absolute -top-2 -left-2 bg-brand-accent w-3 h-3 rounded-full"
        />
      </motion.div>
    </div>
  );
}
