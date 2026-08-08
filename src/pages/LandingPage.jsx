import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, ShieldCheck, ArrowRight, BarChart3 } from 'lucide-react';
import { 
  fadeInUp, staggerContainer, staggerItem, buttonTap, inViewProps
} from '../utils/animationVariants';

export function LandingPage() {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Dynamic background glow — subtle float */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-transparent blur-[160px] pointer-events-none rounded-full animate-pulse-glow" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 glow-indigo"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Powered by Gemini AI &amp; Firestore</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-white"
        >
          Generate &amp; Master <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-purple-500">
            AI-Powered Mock Exams
          </span>
          <br />
          In Seconds
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 mb-10 leading-relaxed font-medium"
        >
          Enter any subject, select your difficulty level, and let Gemini AI generate interactive multiple-choice tests with step-by-step explanations, live scoring, and Firestore history tracking.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <motion.div {...buttonTap} className="w-full sm:w-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm text-slate-200 glass-card hover:bg-slate-800/80 border border-slate-800 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Sign In</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          variants={staggerContainer}
          {...inViewProps}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left"
        >
          {[
            {
              icon: <Cpu className="w-7 h-7" />,
              iconBg: 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400',
              title: 'Gemini AI Generation',
              desc: 'Specify subject, difficulty (Easy, Medium, Hard), and total questions to generate structured JSON tests instantly.',
            },
            {
              icon: <ShieldCheck className="w-7 h-7" />,
              iconBg: 'bg-purple-600/20 border-purple-500/30 text-purple-400',
              title: 'Firebase Auth & Firestore',
              desc: 'Google OAuth popup and Email/Password security with Firestore collections for users, exams, and detailed results.',
            },
            {
              icon: <BarChart3 className="w-7 h-7" />,
              iconBg: 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400',
              title: 'Instant Scoring & AI Hints',
              desc: 'Live timed exams with progress tracking, instant percentage scoring, correct/wrong counts, and detailed AI explanations.',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -7, boxShadow: '0 24px 40px -12px rgba(99,102,241,0.2)' }}
              transition={{ duration: 0.25 }}
              className="glass-card p-8 rounded-3xl glass-card-hover border border-slate-800"
            >
              <div className={`w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center mb-6 shadow-inner`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </section>
    </div>
  );
}
