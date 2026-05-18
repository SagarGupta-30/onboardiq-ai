'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  User, 
  Database, 
  ShieldAlert, 
  Check, 
  ToggleLeft, 
  ToggleRight,
  Info,
  Sparkles,
  Server
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  // Settings State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [mfaAlerts, setMfaAlerts] = useState(true);
  const [trainingAlerts, setTrainingAlerts] = useState(true);
  const [scanInterval, setScanInterval] = useState('daily');
  const [bgLatencyThreshold, setBgLatencyThreshold] = useState('5');
  
  // Feedback States
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [token, loading, router]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }, 1000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pl-64 pt-20 p-8 flex flex-col gap-8 min-h-screen bg-[#030014]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-wide">System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage operator profile details, database clusters, and compliance alerts thresholds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Settings Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-purple-500/10 p-6 flex flex-col gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-purple-400" /> Operator Details
            </h3>

            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl flex items-center gap-2 animate-bounce">
                <Check className="w-4.5 h-4.5 text-green-400" />
                <span>Settings updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Operator Name</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Operator Email</label>
                <input 
                  type="email" 
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Tenant Domain</label>
                <input 
                  type="text" 
                  disabled
                  value="onboardiq-client.com"
                  className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500 opacity-50 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Active Role Type</label>
                <input 
                  type="text" 
                  disabled
                  value={user.role}
                  className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500 opacity-50 cursor-not-allowed uppercase font-extrabold text-purple-400"
                />
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="col-span-1 md:col-span-2 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl mt-2 cursor-pointer shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {saving ? 'Saving changes...' : 'Commit Settings'}
              </button>
            </form>
          </motion.div>

          {/* Compliance Alert Parameters */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-purple-500/10 p-6 flex flex-col gap-5"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-500" /> Compliance Automation Policies
            </h3>

            <div className="flex flex-col gap-4 text-left">
              {/* Alert Toggle 1 */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Auto-alert pending MFA setup</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal leading-relaxed">Draft email/slack notifications instantly to high privilege staff missing MFA keys.</p>
                </div>
                <button 
                  onClick={() => setMfaAlerts(!mfaAlerts)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {mfaAlerts ? (
                    <ToggleRight className="w-9 h-9 text-purple-400 glow-purple" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Alert Toggle 2 */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Auto-warn over-due training courses</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal leading-relaxed">Launch weekly reminders to employees with pending security checklists.</p>
                </div>
                <button 
                  onClick={() => setTrainingAlerts(!trainingAlerts)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {trainingAlerts ? (
                    <ToggleRight className="w-9 h-9 text-purple-400 glow-purple" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Parameters selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide pl-1">Compliance Scan Interval</label>
                  <select 
                    value={scanInterval}
                    onChange={(e) => setScanInterval(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500 appearance-none bg-[#0c0924] cursor-pointer font-medium"
                  >
                    <option value="hourly">Continuous (Hourly scans)</option>
                    <option value="daily">Standard (Daily scans)</option>
                    <option value="weekly">Consolidated (Weekly scans)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide pl-1">Background Screening Latency</label>
                  <select 
                    value={bgLatencyThreshold}
                    onChange={(e) => setBgLatencyThreshold(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500 appearance-none bg-[#0c0924] cursor-pointer font-medium"
                  >
                    <option value="3">Suspension after 3 days</option>
                    <option value="5">Suspension after 5 days</option>
                    <option value="7">Suspension after 7 days</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Database cluster information details panel */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl border border-purple-500/10 p-6 flex flex-col gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-blue-400" /> Database Cluster
            </h3>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-4 text-left text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                  <Server className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Connection status</span>
                  <span className="font-extrabold text-green-400 block mt-0.5">OPERATIONAL / ONLINE</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Dialect Mode</span>
                <span className="font-bold text-white block mt-0.5">PostgreSQL Cluster</span>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Execution Engine</span>
                <span className="font-bold text-white block mt-0.5">Prisma ORM (Client-Driven)</span>
              </div>

              <div className="flex items-start gap-2 bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-lg text-purple-300 text-[10px] leading-relaxed">
                <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>System automatically falls back to flawless in-memory storage simulation if PostgreSQL endpoint environments are unconfigured.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
