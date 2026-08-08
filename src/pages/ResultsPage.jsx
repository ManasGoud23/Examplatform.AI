import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getResultById } from '../services/resultService';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  Home, 
  Loader2,
  Share2,
  Award
} from 'lucide-react';
import { 
  fadeInUp, staggerContainer, staggerItem, buttonTap, inViewProps
} from '../utils/animationVariants';

export function ResultsPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      if (id) {
        try {
          const data = await getResultById(id);
          setResult(data);
        } catch (e) {
          console.error("Error fetching result:", e);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchResult();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Result link copied to clipboard!');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 text-indigo-400"
      >
        <div className="flex flex-col items-center space-y-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-purple-600/10 border border-purple-500/30 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <svg className="absolute inset-0 w-16 h-16 animate-orbit" viewBox="0 0 64 64" fill="none">
              <circle
                cx="32" cy="32" r="28"
                stroke="url(#resultsSpinGrad)"
                strokeWidth="2.5"
                strokeDasharray="44 132"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="resultsSpinGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-400">Calculating Scores &amp; AI Explanations...</p>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-md mx-auto my-20 text-center glass-card p-8 rounded-3xl space-y-4 border border-slate-800">
        <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-extrabold text-white">Result Not Found</h2>
        <p className="text-sm text-slate-400">Unable to retrieve test results from Firestore.</p>
        <Link to="/dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 font-bold text-white text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const minutesSpent = Math.floor((result.timeSpentSeconds || 0) / 60);
  const secondsSpent = (result.timeSpentSeconds || 0) % 60;
  const isPassed = result.percentage >= 70;

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-10 space-y-8"
    >
      
      {/* Score Hero Card */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-800 text-center relative overflow-hidden space-y-6 glow-indigo">
        
        {/* Background glow accent */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-3xl pointer-events-none rounded-full animate-pulse-glow ${
          isPassed ? 'bg-emerald-500/15' : 'bg-amber-500/15'
        }`} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2 relative z-10"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Official Assessment Summary</span>
          </div>
          <h1 className="text-3xl font-black text-white">{result.examTitle}</h1>
        </motion.div>

        {/* Big Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 space-y-2"
        >
          <div className="text-6xl sm:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-purple-500 tabular-nums">
            {result.percentage}%
          </div>
          <p className="text-sm font-bold text-slate-300">
            {isPassed ? '🎉 Great Job! Assessment Passed' : '💪 Keep Practicing! Try again to boost your score'}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 relative z-10"
        >
          {[
            { label: 'Total Score', value: `${result.score} / ${result.totalScore}`, cls: 'text-white', bg: 'bg-slate-900/60 border-slate-800' },
            { label: 'Correct', value: result.correctAnswersCount, cls: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Wrong', value: result.wrongAnswersCount, cls: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
            { label: 'Time Spent', value: `${minutesSpent}m ${secondsSpent}s`, cls: 'text-indigo-300', bg: 'bg-slate-900/60 border-slate-800' },
          ].map((m) => (
            <motion.div
              key={m.label}
              variants={staggerItem}
              whileHover={{ scale: 1.04 }}
              className={`p-4 rounded-2xl border ${m.bg}`}
            >
              <span className="text-xs text-slate-400 font-extrabold uppercase">{m.label}</span>
              <p className={`text-2xl font-black ${m.cls} mt-1 tabular-nums`}>{m.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10"
        >
          <motion.div {...buttonTap}>
            <Link
              to="/generate"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Generate New Test</span>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs text-slate-300 glass-card hover:bg-slate-800 flex items-center justify-center space-x-2 border border-slate-700 transition-all"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>Share Result</span>
          </motion.button>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs text-slate-300 glass-card hover:bg-slate-800 flex items-center justify-center space-x-2 border border-slate-700 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </motion.div>
        </motion.div>

      </div>

      {/* Itemized AI Explanations */}
      <div className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-black text-white flex items-center space-x-2"
        >
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span>Question Review &amp; AI Explanations</span>
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          {...inViewProps}
          className="space-y-6"
        >
          {result.answers?.map((ans, idx) => (
            <motion.div 
              key={idx} 
              variants={staggerItem}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
              className={`glass-card p-6 rounded-3xl border ${
                ans.isCorrect ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'
              } space-y-4`}
            >
              
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-bold text-white">
                  Q{idx + 1}. {ans.questionText}
                </h3>
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold flex-shrink-0 ${
                  ans.isCorrect 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {ans.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{ans.isCorrect ? 'Correct' : 'Incorrect'}</span>
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                {ans.options?.map((opt, optIdx) => {
                  const isUserSelected = ans.selectedOption === optIdx;
                  const isCorrectAnswer = ans.correctAnswerIndex === optIdx;

                  let style = "bg-slate-900/60 border-slate-800 text-slate-400";
                  if (isCorrectAnswer) {
                    style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold";
                  } else if (isUserSelected && !isCorrectAnswer) {
                    style = "bg-rose-500/20 border-rose-500/50 text-rose-200 line-through";
                  }

                  return (
                    <div key={optIdx} className={`p-3 rounded-2xl border flex items-center justify-between ${style}`}>
                      <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                      {isCorrectAnswer && <span className="text-xs text-emerald-400 font-extrabold ml-2">(Correct)</span>}
                      {isUserSelected && !isCorrectAnswer && <span className="text-xs text-rose-400 font-extrabold ml-2">(Your Answer)</span>}
                    </div>
                  );
                })}
              </div>

              {/* AI Explanation */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gemini AI Explanation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {ans.explanation}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>

    </motion.div>
  );
}
