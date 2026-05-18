'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Fingerprint, 
  Mail, 
  Lock, 
  User, 
  Building,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('HR');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !company) return;

    setLoading(true);
    setTimeout(() => {
      login('mock_token_signup_2026', {
        id: `u-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030014] flex flex-col justify-center items-center px-6 py-12">
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
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

        <h2 className="text-xl font-extrabold text-white text-center">Request Organization Portal</h2>
        <p className="text-xs text-slate-400 text-center mt-1.5 mb-6">Initialize security posture pipeline for your workforce</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide pl-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Sarah Jenkins" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-xs glass-input focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide pl-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder="sarah.jenkins@onboardiq.ai" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-xs glass-input focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide pl-1">Company Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Acme Corp" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-xs glass-input focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide pl-1">Organizational Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-xs glass-input focus:border-purple-500 appearance-none cursor-pointer"
            >
              <option value="HR" className="bg-[#0c0924]">HR Specialist (Onboarding focus)</option>
              <option value="SECURITY_OFFICER" className="bg-[#0c0924]">Security / Compliance Officer</option>
              <option value="ADMIN" className="bg-[#0c0924]">Full Admin (Access Control)</option>
            </select>
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
                required
                className="w-full pl-10 pr-4 py-3 text-xs glass-input focus:border-purple-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Initializing Pipeline...' : 'Request Tenant Provision'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-slate-400 text-[11px]">Already registered? </span>
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold text-[11px]">
            Portal Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
