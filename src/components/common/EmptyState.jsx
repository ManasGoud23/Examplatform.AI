import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { fadeInScale } from '../../utils/animationVariants';

export function EmptyState({ 
  icon: Icon = Sparkles, 
  title = "No Data Found", 
  description = "Get started by generating your first AI-powered exam.", 
  actionText = "Generate AI Exam", 
  actionLink = "/generate",
  onActionClick
}) {
  return (
    <motion.div
      variants={fadeInScale}
      initial="hidden"
      animate="visible"
      className="glass-card p-12 rounded-3xl border border-slate-800/80 text-center space-y-6 max-w-lg mx-auto my-8"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-lg shadow-indigo-500/10"
      >
        <Icon className="w-8 h-8" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="space-y-2"
      >
        <h3 className="text-xl font-bold text-white dark:text-white">{title}</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>

      {actionText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          {actionLink ? (
            <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} className="inline-flex">
              <Link
                to={actionLink}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all group"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onActionClick}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all group"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
