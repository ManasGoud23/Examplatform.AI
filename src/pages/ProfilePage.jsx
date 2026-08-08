import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';
import { User, Mail, Calendar, Save, Loader2, ShieldCheck } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem, buttonTap } from '../utils/animationVariants';

export function ProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(userProfile?.name || userProfile?.displayName || user?.displayName || '');
  }, [userProfile, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: name.trim(),
        displayName: name.trim()
      });
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const creationDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-4 py-10 space-y-8"
    >
      
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
          <User className="w-4 h-4 text-purple-400" />
          <span>User Account</span>
        </div>
        <h1 className="text-3xl font-black text-white">Profile Settings</h1>
        <p className="text-sm text-slate-400">View account details and update your Firestore user profile.</p>
      </div>

      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8 glow-indigo">
        
        {/* User Badge Banner */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-2xl border border-indigo-500/40 object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-2xl text-white shadow-lg">
                {(name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-white">{name || 'User'}</h2>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user?.email}</span>
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified Firebase User
              </span>
            </div>
          </div>
        </motion.div>

        {/* Readonly Account Details */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[
            {
              icon: <Mail className="w-3 h-3 text-indigo-400" />,
              label: 'Email Address',
              value: user?.email,
              valueClass: 'text-white truncate'
            },
            {
              icon: <Calendar className="w-3 h-3 text-purple-400" />,
              label: 'Account Created',
              value: creationDate,
              valueClass: 'text-white'
            }
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={staggerItem}
              whileHover={{ scale: 1.02, borderColor: 'rgba(99,102,241,0.3)' }}
              className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1 transition-colors duration-200"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                {item.icon}
                <span>{item.label}</span>
              </span>
              <p className={`text-sm font-bold ${item.valueClass}`}>{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-medium transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500">Updating this updates both Firebase Authentication &amp; your Firestore profile.</p>
          </div>

          <motion.button
            {...buttonTap}
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </motion.button>
        </form>

      </div>

    </motion.div>
  );
}
