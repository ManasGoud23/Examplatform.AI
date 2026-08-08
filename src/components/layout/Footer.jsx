import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';
import { staggerContainer, staggerItem, inViewProps } from '../../utils/animationVariants';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-10 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          {...inViewProps}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
        >
          <motion.div variants={staggerItem} className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-white">ExamPlatform<span className="text-purple-400">.AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Next-generation AI test generation and instant exam grading powered by Google Gemini AI &amp; Firestore database.
            </p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h4 className="text-xs font-black text-slate-200 mb-3 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="flex items-center space-x-2 hover:text-slate-300 transition-colors duration-150">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gemini AI Exam Generator</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-slate-300 transition-colors duration-150">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Instant Score Evaluation</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-slate-300 transition-colors duration-150">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Firestore Test Storage</span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h4 className="text-xs font-black text-slate-200 mb-3 uppercase tracking-wider">Authentication</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              {['Google OAuth Popup', 'Email & Password Auth', 'Protected Private Routes', 'Session Persistence'].map((item) => (
                <li key={item} className="hover:text-slate-300 transition-colors duration-150">{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h4 className="text-xs font-black text-slate-200 mb-3 uppercase tracking-wider">System Status</h4>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All Systems Operational</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} ExamPlatform.AI. All rights reserved. Built with React, Vite, Gemini AI &amp; Firestore.
        </div>
      </div>
    </footer>
  );
}
