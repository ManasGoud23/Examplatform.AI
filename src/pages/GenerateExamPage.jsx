import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { generateAIExam } from '../services/geminiService';
import { saveExam } from '../services/examService';
import { Sparkles, Cpu, BookOpen, Layers, Hash, ArrowRight, Key, Settings, CheckCircle2 } from 'lucide-react';
import { fadeInUp, slideDown, buttonTap, staggerContainer, staggerItem } from '../utils/animationVariants';

export function GenerateExamPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('JavaScript');
  const [customSubject, setCustomSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('gemini_api_key') || '');

  const popularSubjects = [
    'JavaScript', 'React', 'Python', 'Data Structures & Algorithms', 
    'World History', 'Physics', 'Machine Learning', 'SQL Databases'
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    const finalSubject = subject === 'Custom' ? customSubject : subject;
    
    if (!finalSubject.trim()) {
      toast.error("Please specify a target subject!");
      return;
    }

    setIsGenerating(true);
    setLoadingStep('Connecting to Gemini AI Engine...');
    toast.loading('Initializing Gemini AI Generator...', { id: 'exam-gen' });

    try {
      setTimeout(() => setLoadingStep('Generating multiple-choice questions in JSON format...'), 1000);
      
      const examData = await generateAIExam(finalSubject, difficulty, parseInt(numQuestions));
      
      setLoadingStep('Saving test parameters to Firestore database...');
      const savedExam = await saveExam(examData, user?.uid);

      setLoadingStep('Test ready! Launching exam environment...');
      toast.success('Exam generated successfully!', { id: 'exam-gen' });
      
      setTimeout(() => {
        navigate(`/exam/${savedExam.id}`);
      }, 500);

    } catch (error) {
      console.error("Failed to generate exam:", error);
      toast.error("An error occurred while generating the exam.", { id: 'exam-gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-12 space-y-8"
    >
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Gemini AI Test Builder</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Create AI-Powered Exam</h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Specify your subject, difficulty, and question count. Gemini AI generates structured multiple-choice questions with full explanations.
        </p>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-indigo-300 transition-colors pt-2"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{showApiKeyInput ? 'Hide Gemini API Key Settings' : 'Configure Custom Gemini API Key'}</span>
        </motion.button>
      </div>

      {/* API Key Panel — animated */}
      <AnimatePresence>
        {showApiKeyInput && (
          <motion.div 
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-card p-6 rounded-3xl border border-indigo-500/30 space-y-3"
          >
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Custom Gemini API Key</span>
            </div>
            <p className="text-xs text-slate-400">
              Enter your Google Gemini API Key below or add <code className="text-indigo-300 font-mono">VITE_GEMINI_API_KEY</code> in <code className="text-indigo-300 font-mono">.env</code>.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-grow px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  if (apiKeyInput.trim()) {
                    localStorage.setItem('gemini_api_key', apiKeyInput.trim());
                    toast.success("Gemini API Key saved!");
                  } else {
                    localStorage.removeItem('gemini_api_key');
                    toast.success("Gemini API Key cleared.");
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold transition-all"
              >
                Save Key
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generator Form */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative glow-indigo">
        
        <AnimatePresence mode="wait">
          {isGenerating ? (
            /* Loading State */
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="py-16 text-center space-y-6"
            >
              {/* Animated ring spinner */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-indigo-400" />
                </div>
                <svg
                  className="absolute inset-0 w-20 h-20 animate-orbit"
                  viewBox="0 0 80 80"
                  fill="none"
                >
                  <circle
                    cx="40" cy="40" r="36"
                    stroke="url(#spinGrad)"
                    strokeWidth="3"
                    strokeDasharray="60 160"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="spinGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Generating Your Exam</h3>
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono text-indigo-300"
                >
                  {loadingStep}
                </motion.p>
              </div>

              {/* Indeterminate progress bar */}
              <div className="w-72 mx-auto bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 h-full rounded-full"
                  animate={{ x: ['-100%', '120%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '60%' }}
                />
              </div>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleGenerate}
              className="space-y-8"
            >
              {/* Subject Selection */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>1. Select or Type Subject</span>
                </label>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {popularSubjects.map((sub) => (
                    <motion.button
                      key={sub}
                      variants={staggerItem}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => { setSubject(sub); setCustomSubject(''); }}
                      className={`p-3.5 rounded-2xl text-xs font-bold transition-all border text-left truncate ${
                        subject === sub 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/10' 
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {sub}
                    </motion.button>
                  ))}
                </motion.div>
                <div className="pt-2">
                  <input
                    type="text"
                    value={subject === 'Custom' ? customSubject : ''}
                    onChange={(e) => { setSubject('Custom'); setCustomSubject(e.target.value); }}
                    placeholder="Or enter custom topic (e.g. Modern Physics, Organic Chemistry)..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>2. Choose Difficulty Level</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Easy', 'Medium', 'Hard'].map((lvl) => (
                    <motion.button
                      key={lvl}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-3.5 px-4 rounded-2xl text-xs font-extrabold transition-all border text-center ${
                        difficulty === lvl
                          ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-purple-500 text-white shadow-lg ring-1 ring-purple-500'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-indigo-400" />
                  <span>3. Number of Questions</span>
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {[5, 10, 15, 20].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setNumQuestions(num)}
                      className={`py-3.5 px-4 rounded-2xl text-xs font-extrabold transition-all border text-center ${
                        numQuestions === num
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {num} Questions
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate CTA */}
              <motion.button
                {...buttonTap}
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all group"
              >
                <Cpu className="w-5 h-5" />
                <span>Generate AI Exam Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>

            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
