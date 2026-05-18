'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  ShieldAlert, 
  CircleHelp,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  // Hide navbar on public pages
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  // Get Page Title
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard Overview';
      case '/employees': return 'Employee Workflows';
      case '/ai-assistant': return 'OnboardIQ AI Assistant';
      case '/security': return 'Security & Compliance Audits';
      case '/reports': return 'Reports & Audit Logs';
      case '/settings': return 'System Settings';
      default: return 'Portal';
    }
  };

  const mockNotifications = [
    { id: 1, title: 'Compliance Warning', text: 'David Kim (DevOps) missing AWS MFA policy sign-off.', severity: 'CRITICAL', time: '1 hr ago' },
    { id: 2, title: 'Onboarding Complete', text: 'Sophia Chen finalized background screening checklists.', severity: 'INFO', time: '2 hrs ago' },
    { id: 3, title: 'Audit Alert', text: 'GDPR status scored at 40% due to incomplete Sales modules.', severity: 'WARNING', time: '5 hrs ago' }
  ];

  return (
    <header className="h-20 glass-panel border-b border-purple-500/10 fixed top-0 right-0 left-64 flex items-center justify-between px-8 z-30">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
          {getPageTitle()}
          {pathname === '/ai-assistant' && (
            <span className="text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> Live Agent
            </span>
          )}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Real-time enterprise posture monitor active</p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Mock Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search compliance, records, files..." 
            className="w-full pl-10 pr-4 py-2 text-xs glass-input focus:border-purple-500"
          />
        </div>

        {/* Support Button */}
        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <CircleHelp className="w-5 h-5" />
        </button>

        {/* Notifications Hub */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/20 transition-all text-slate-300 hover:text-white cursor-pointer relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full glow-purple animate-pulse"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop closer */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                
                {/* Panel */}
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 glass-card rounded-2xl p-4 shadow-2xl border border-purple-500/20 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                    <h3 className="text-sm font-bold text-white">Live Compliance Feed</h3>
                    <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-semibold">3 active</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {mockNotifications.map(notif => (
                      <div key={notif.id} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex gap-3 hover:bg-white/10 transition-colors">
                        <div className={`mt-0.5 p-1 rounded-md ${
                          notif.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          notif.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                            <span className="text-[9px] text-slate-500">{notif.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal leading-relaxed">{notif.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full text-center text-xs text-purple-400 font-medium hover:text-purple-300 mt-4 pt-2 border-t border-white/5 cursor-pointer">
                    View all activity
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
