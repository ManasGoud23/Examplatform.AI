import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

export function Timer({ durationMinutes, onTimeUp, onTick }) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
  }, [durationMinutes]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(durationMinutes * 60 - next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsLeft, durationMinutes, onTimeUp, onTick]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 120; // Under 2 minutes

  return (
    <motion.div
      animate={isUrgent ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={isUrgent ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : {}}
      className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-sm font-mono font-bold transition-all duration-500 ${
        isUrgent 
          ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' 
          : 'bg-slate-800/80 border-slate-700 text-indigo-300'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isUrgent ? (
          <motion.span
            key="urgent"
            initial={{ opacity: 0, rotate: -15 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </motion.span>
        ) : (
          <motion.span
            key="clock"
            initial={{ opacity: 0, rotate: 15 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Clock className="w-4 h-4 text-indigo-400" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </motion.div>
  );
}
