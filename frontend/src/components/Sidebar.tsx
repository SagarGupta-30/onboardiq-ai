'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  ShieldAlert, 
  FilePieChart, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Fingerprint
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Hide sidebar on landing page, login, and signup
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['HR', 'ADMIN', 'SECURITY_OFFICER', 'EMPLOYEE'] },
    { name: 'Employees', path: '/employees', icon: Users, roles: ['HR', 'ADMIN', 'SECURITY_OFFICER'] },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, roles: ['HR', 'ADMIN', 'SECURITY_OFFICER', 'EMPLOYEE'] },
    { name: 'Security Center', path: '/security', icon: ShieldCheck, roles: ['SECURITY_OFFICER', 'ADMIN', 'HR'] },
    { name: 'Reports & Logs', path: '/reports', icon: FilePieChart, roles: ['SECURITY_OFFICER', 'ADMIN', 'HR'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['HR', 'ADMIN', 'SECURITY_OFFICER', 'EMPLOYEE'] },
  ];

  const filteredItems = navItems.filter(item => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <aside className="w-64 glass-panel border-r border-purple-500/10 min-h-screen fixed left-0 top-0 flex flex-col justify-between p-4 z-40">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="bg-gradient-to-tr from-purple-600 to-blue-500 p-2.5 rounded-xl glow-purple flex items-center justify-center">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-wider">Onboard<span className="text-purple-400">IQ</span></span>
            <div className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">AI COMPLIANCE</div>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-inner">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{user?.name || 'Loading...'}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">{user?.role || 'Guest'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path} className="relative">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/5 border-l-2 border-purple-500 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'text-purple-400 glow-purple' : 'text-slate-400'
                  }`} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <button 
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 mt-auto cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        Log out System
      </button>
    </aside>
  );
}
