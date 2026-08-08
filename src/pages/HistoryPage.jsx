import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserResults } from '../services/resultService';
import { CardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { History as HistoryIcon, ArrowRight, BookOpen, Filter, Search } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animationVariants';

export function HistoryPage() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadHistory() {
      if (user?.uid) {
        try {
          const data = await getUserResults(user.uid);
          setResults(data || []);
        } catch (e) {
          console.error("Failed to load history:", e);
        } finally {
          setLoading(false);
        }
      }
    }
    loadHistory();
  }, [user]);

  const subjects = ['All', ...new Set(results.map(r => r.examSubject).filter(Boolean))];

  const filteredResults = results.filter((r) => {
    const matchesSubject = filterSubject === 'All' || r.examSubject === filterSubject;
    const matchesSearch = !searchQuery.trim() || 
      (r.examTitle && r.examTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.examSubject && r.examSubject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      
      {/* Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            <HistoryIcon className="w-4 h-4 text-purple-400" />
            <span>Firestore Records</span>
          </div>
          <h1 className="text-3xl font-black text-white">Exam History</h1>
        </motion.div>

        {/* Filter & Search */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all w-full sm:w-48"
            />
          </div>

          {subjects.length > 1 && (
            <div className="flex items-center space-x-2 glass-card px-3 py-2 rounded-xl border border-slate-800">
              <Filter className="w-4 h-4 text-indigo-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
              >
                {subjects.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>
          )}
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredResults.length === 0 ? (
        <EmptyState 
          icon={BookOpen}
          title="No Matching History Found"
          description={searchQuery || filterSubject !== 'All' ? "Try clearing filters to view all recorded exams." : "Generate a test using Gemini AI to start populating your exam history."}
          actionText={searchQuery || filterSubject !== 'All' ? "Clear Filters" : "Generate AI Exam"}
          onActionClick={() => {
            setSearchQuery('');
            setFilterSubject('All');
          }}
          actionLink={searchQuery || filterSubject !== 'All' ? undefined : "/generate"}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResults.map((res) => (
            <motion.div 
              key={res.id} 
              variants={staggerItem}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(99,102,241,0.2)' }}
              transition={{ duration: 0.22 }}
              className="glass-card p-6 rounded-3xl border border-slate-800 glass-card-hover space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    {res.examSubject || 'General'}
                  </span>
                  <span className={`text-2xl font-black tabular-nums ${
                    res.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {res.percentage}%
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1">{res.examTitle}</h3>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div>Score: <strong className="text-slate-200">{res.score}/{res.totalScore}</strong></div>
                  <div>Correct: <strong className="text-emerald-400">{res.correctAnswersCount}</strong></div>
                  <div>Wrong: <strong className="text-rose-400">{res.wrongAnswersCount}</strong></div>
                  <div>Duration: <strong className="text-indigo-300">{Math.round((res.timeSpentSeconds || 0) / 60)}m</strong></div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={`/results/${res.id}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center space-x-2 transition-all mt-4 group"
                >
                  <span>View Full AI Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </motion.div>

            </motion.div>
          ))}
        </motion.div>
      )}

    </motion.div>
  );
}
