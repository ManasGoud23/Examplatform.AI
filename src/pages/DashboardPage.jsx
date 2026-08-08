import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserResults } from '../services/resultService';
import { StatSkeleton, ChartSkeleton, CardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Sparkles, 
  PlusCircle, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BarChart2, 
  BookOpen, 
  Award,
  TrendingUp,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react';
import {
  fadeInUp, staggerContainer, staggerItem, buttonTap, cardHoverProps, inViewProps
} from '../utils/animationVariants';

export function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        try {
          const userHistory = await getUserResults(user.uid);
          setResults(userHistory || []);
        } catch (e) {
          console.error("Failed to load dashboard data:", e);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user]);

  const totalExams = results.length;
  const avgScore = totalExams > 0 
    ? Math.round(results.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalExams) 
    : 0;
  const passedExams = results.filter(r => (r.percentage || 0) >= 70).length;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
  const totalQuestionsAnswered = results.reduce((acc, curr) => acc + (curr.totalScore || 0), 0);
  const totalTimeMinutes = Math.round(results.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0) / 60);

  // Recharts data
  const trendData = [...results].reverse().map((r, idx) => ({
    name: `Exam #${idx + 1}`,
    subject: r.examSubject || 'General',
    score: r.percentage || 0,
    date: r.completedAt?.toDate ? r.completedAt.toDate().toLocaleDateString() : 'Recent'
  }));

  const subjectMap = {};
  results.forEach(r => {
    const sub = r.examSubject || 'General';
    if (!subjectMap[sub]) subjectMap[sub] = { totalPercentage: 0, count: 0 };
    subjectMap[sub].totalPercentage += (r.percentage || 0);
    subjectMap[sub].count += 1;
  });

  const subjectData = Object.keys(subjectMap).map(sub => ({
    subject: sub,
    avg: Math.round(subjectMap[sub].totalPercentage / subjectMap[sub].count)
  }));

  const pieData = [
    { name: 'Passed (≥70%)', value: passedExams, color: '#10b981' },
    { name: 'Needs Work (<70%)', value: totalExams - passedExams, color: '#f59e0b' }
  ];

  const statCards = [
    { icon: <BookOpen className="w-6 h-6" />, iconBg: 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400', label: 'Exams Completed', value: totalExams, valueClass: 'text-white' },
    { icon: <Trophy className="w-6 h-6" />, iconBg: 'bg-purple-600/20 border-purple-500/30 text-purple-400', label: 'Average Score', value: `${avgScore}%`, valueClass: 'text-white' },
    { icon: <Target className="w-6 h-6" />, iconBg: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400', label: 'Pass Rate', value: `${passRate}%`, valueClass: 'text-emerald-400' },
    { icon: <Clock className="w-6 h-6" />, iconBg: 'bg-amber-600/20 border-amber-500/30 text-amber-400', label: 'Study Time', value: `${totalTimeMinutes}m`, valueClass: 'text-white' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome SaaS Banner */}
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glow-indigo"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Analytics Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, {userProfile?.name || userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Monitor real-time progress, generate targeted Gemini AI exams, and view your itemized performance metrics saved in Firestore.
          </p>
        </div>

        <motion.div {...buttonTap} className="relative z-10 flex-shrink-0">
          <Link
            to="/generate"
            className="px-6 py-4 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition-all group"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Generate AI Exam</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </motion.div>

      {/* KPI Metrics — staggered entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="contents"
          >
            {statCards.map((card, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(99,102,241,0.18)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4 glass-card-hover cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} border flex items-center justify-center shadow-inner`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                  <p className={`text-3xl font-black ${card.valueClass} mt-0.5 tabular-nums`}>{card.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Charts Section */}
      {!loading && totalExams > 0 && (
        <motion.div
          variants={staggerContainer}
          {...inViewProps}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Score Progression */}
          <motion.div variants={staggerItem} className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Score Progression Trend</span>
                </h3>
                <p className="text-xs text-slate-400">Historical performance across recent exam attempts</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Recharts Analytics
              </span>
            </div>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#scoreGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Subject Breakdown */}
          <motion.div variants={staggerItem} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                <span>Subject Mastery</span>
              </h3>
              <p className="text-xs text-slate-400">Average score grouped by topic</p>
            </div>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <XAxis dataKey="subject" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="avg" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recent Exam History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl font-extrabold text-white flex items-center space-x-2"
          >
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Recent Exam Activity</span>
          </motion.h2>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/history" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 group transition-colors duration-150">
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : results.length === 0 ? (
          <EmptyState 
            icon={BookOpen}
            title="No Exam Results Found"
            description="You haven't completed any tests yet. Click below to generate your first AI exam using Gemini!"
            actionText="Generate AI Exam Now"
            actionLink="/generate"
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {results.slice(0, 6).map((res) => (
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

                  <h3 className="text-base font-extrabold text-white line-clamp-1">{res.examTitle}</h3>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <div>Score: <strong className="text-slate-200">{res.score}/{res.totalScore}</strong></div>
                    <div>Correct: <strong className="text-emerald-400">{res.correctAnswersCount}</strong></div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={`/results/${res.id}`}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-indigo-300 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center space-x-1.5 transition-all mt-4 group"
                  >
                    <span>View Full AI Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

    </div>
  );
}
