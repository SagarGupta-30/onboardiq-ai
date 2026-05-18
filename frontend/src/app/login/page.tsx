'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Fingerprint, 
  Mail, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleTestLogin = (role: 'HR' | 'SECURITY_OFFICER') => {
    setLoading(true);
    setTimeout(() => {
      if (role === 'HR') {
        login('mock_token_sarah_jenkins_2026', {
          id: 'u1',
          name: 'Sarah Jenkins',
          email: 'admin@onboardiq.ai',
          role: 'HR'
        });
      } else {
        login('mock_token_marcus_vance_2026', {
          id: 'u2',
          name: 'Marcus Vance',
          email: 'security@onboardiq.ai',
          role: 'SECURITY_OFFICER'
        });
      }
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide all details');
      return;
    }
    
    // Default form signin to HR demo
    setLoading(true);
    setTimeout(() => {
      login('mock_token_generic_2026', {
        id: 'u-custom',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: email.includes('security') ? 'SECURITY_OFFICER' : 'HR'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030014] flex flex-col justify-center items-center px-6">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Brand Title */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => router.push('/')}>
        <div className="bg-gradient-to-tr from-purple-600 to-blue-500 p-2.5 rounded-xl flex items-center justify-center glow-purple">
          <Fingerprint className="w-6 h-6 text-white" />
        </div>
        <span className="font-extrabold text-xl text-white tracking-wider">Onboard<span className="text-purple-400">IQ</span></span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md glass-card rounded-3xl p-8 border border-purple-500/15 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>

        <h2 className="text-xl font-extrabold text-white text-center">Access Compliance Portal</h2>
        <p className="text-xs text-slate-400 text-center mt-1.5 mb-6">Log in to assess real-time workforce risk scores</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-xs flex gap-2 items-center">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide pl-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder="admin@onboardiq.ai" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs glass-input focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide pl-1">Secure Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs glass-input focus:border-purple-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-slate-400 text-[11px]">Don't have access? </span>
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold text-[11px]">
            Request Org Access
          </Link>
        </div>

        {/* Demo Fast Account Switcher - Highly Premium */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">
            <Info className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Sandbox Quick-Switch
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleTestLogin('HR')}
              disabled={loading}
              className="py-2.5 px-3 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold rounded-xl hover:bg-purple-500/20 transition-all flex flex-col items-center gap-0.5 cursor-pointer disabled:opacity-50"
            >
              <span>HR Administrator</span>
              <span className="text-[8px] text-purple-400 font-normal">Sarah Jenkins</span>
            </button>
            <button 
              onClick={() => handleTestLogin('SECURITY_OFFICER')}
              disabled={loading}
              className="py-2.5 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold rounded-xl hover:bg-blue-500/20 transition-all flex flex-col items-center gap-0.5 cursor-pointer disabled:opacity-50"
            >
              <span>Security Officer</span>
              <span className="text-[8px] text-blue-400 font-normal">Marcus Vance</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
