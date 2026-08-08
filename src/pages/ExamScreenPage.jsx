import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getExamById } from '../services/examService';
import { saveExamResult } from '../services/resultService';
import { ProgressBar } from '../components/common/ProgressBar';
import { Timer } from '../components/common/Timer';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Bookmark,
  X,
  Sparkles
} from 'lucide-react';
import { fadeInScale, overlayVariant, fadeInUp, buttonTap } from '../utils/animationVariants';

export function ExamScreenPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchExam() {
      if (id) {
        try {
          const data = await getExamById(id);
          if (data) {
            setExam(data);
          } else {
            console.error("Exam not found");
          }
        } catch (e) {
          console.error("Failed to load exam:", e);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchExam();
  }, [id]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 text-indigo-400"
      >
        <div className="flex flex-col items-center space-y-5">
          {/* Orbit spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <svg className="absolute inset-0 w-16 h-16 animate-orbit" viewBox="0 0 64 64" fill="none">
              <circle
                cx="32" cy="32" r="28"
                stroke="url(#examSpinGrad)"
                strokeWidth="2.5"
                strokeDasharray="44 132"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="examSpinGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-400">Preparing AI Exam Environment...</p>
        </div>
      </motion.div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-md mx-auto my-20 text-center glass-card p-8 rounded-3xl space-y-4 border border-slate-800">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-extrabold text-white">Exam Not Found</h2>
        <p className="text-sm text-slate-400">The requested exam could not be retrieved.</p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 font-bold text-white text-xs"
        >
          Return to Dashboard
        </motion.button>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentIndex];
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const toggleBookmark = () => {
    const isCurrentlyBookmarked = bookmarks[currentQuestion.id];
    setBookmarks((prev) => ({
      ...prev,
      [currentQuestion.id]: !isCurrentlyBookmarked
    }));
    if (!isCurrentlyBookmarked) {
      toast.success(`Question ${currentIndex + 1} bookmarked`);
    } else {
      toast('Bookmark removed', { icon: '🗑️' });
    }
  };

  const handleFinishExam = async () => {
    setIsSubmitting(true);
    toast.loading('Evaluating answers & generating AI score...', { id: 'submit-exam' });

    let correctCount = 0;
    const answerDetails = exam.questions.map((q) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.question,
        options: q.options,
        selectedOption: selected !== undefined ? selected : null,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const wrongCount = totalQuestions - correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const resultPayload = {
      id: `result-${Date.now()}`,
      userId: user?.uid || 'anonymous',
      examId: exam.id,
      examTitle: exam.title,
      examSubject: exam.subject,
      examDifficulty: exam.difficulty,
      score: correctCount,
      totalScore: totalQuestions,
      percentage,
      correctAnswersCount: correctCount,
      wrongAnswersCount: wrongCount,
      timeSpentSeconds: timeSpent,
      answers: answerDetails,
    };

    try {
      const savedResult = await saveExamResult(resultPayload);
      toast.success('Exam submitted successfully!', { id: 'submit-exam' });
      navigate(`/results/${savedResult.id}`);
    } catch (e) {
      console.error("Failed to save exam results:", e);
      toast.error("Error saving exam results. Please try again.", { id: 'submit-exam' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 py-8 space-y-6"
    >
      
      {/* Top Header Controls */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 glow-indigo">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {exam.subject}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {exam.difficulty}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white">{exam.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Timer 
            durationMinutes={exam.durationMinutes || 10} 
            onTick={(seconds) => setTimeSpent(seconds)}
            onTimeUp={handleFinishExam}
          />

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Exam</span>
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800">
        <ProgressBar 
          current={currentIndex + 1} 
          total={totalQuestions} 
          percentage={Math.round((answeredCount / totalQuestions) * 100)} 
        />
      </div>

      {/* Question Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Question */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Question {currentIndex + 1} of {totalQuestions}</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={toggleBookmark}
                    className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      bookmarks[currentQuestion.id]
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{bookmarks[currentQuestion.id] ? 'Bookmarked' : 'Bookmark'}</span>
                  </motion.button>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected = userAnswers[currentQuestion.id] === optIdx;
                    return (
                      <motion.button
                        key={optIdx}
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all duration-200 ${
                            isSelected ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentIndex === totalQuestions - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 h-fit">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2">
            {exam.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              const isBookmarked = bookmarks[q.id];

              return (
                <motion.button
                  key={q.id}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center border ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/50'
                      : isAnswered
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isBookmarked && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-purple-600/40 border border-purple-500" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-amber-400" />
              <span>Bookmarked</span>
            </div>
          </div>
        </div>

      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            key="overlay"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowSubmitModal(false); }}
          >
            <motion.div 
              variants={fadeInScale}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative glow-indigo"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400"
                >
                  <Send className="w-7 h-7" />
                </motion.div>
                <h3 className="text-2xl font-black text-white">Submit Exam Now?</h3>
                <p className="text-sm text-slate-400">
                  You have answered <strong className="text-indigo-300 font-extrabold">{answeredCount}</strong> of <strong className="text-white font-extrabold">{totalQuestions}</strong> questions.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSubmitModal(false)}
                  className="w-1/2 py-3 rounded-xl font-bold text-xs border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all"
                >
                  Continue Test
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleFinishExam}
                  disabled={isSubmitting}
                  className="w-1/2 py-3 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Submit</span>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
