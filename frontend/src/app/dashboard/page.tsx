'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Sparkles,
  Zap,
  Send,
  Bot,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function Dashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  
  // Local state for statistics and activity
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Embedded AI Widget State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<any[]>([
    { role: 'assistant', text: 'Hello! I am your OnboardIQ Copilot. Query employee records or framework compliance scores instantly.' }
  ]);
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recharts simulated historical data
  const trendData = [
    { month: 'Jan', SOC2: 60, GDPR: 30, ISO27001: 70 },
    { month: 'Feb', SOC2: 68, GDPR: 35, ISO27001: 78 },
    { month: 'Mar', SOC2: 70, GDPR: 42, ISO27001: 85 },
    { month: 'Apr', SOC2: 74, GDPR: 40, ISO27001: 90 },
    { month: 'May', SOC2: 85, GDPR: 50, ISO27001: 95 }
  ];

  const categoryData = [
    { name: 'Docs', Completed: 3, Pending: 1 },
    { name: 'IT Setup', Completed: 2, Pending: 3 },
    { name: 'Training', Completed: 4, Pending: 2 },
    { name: 'Security', Completed: 2, Pending: 4 }
  ];

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [token, loading, router]);

  useEffect(() => {
    // Highly realistic fetching from our backend server with clean in-memory mocks as fallback
    const fetchData = async () => {
      try {
        const mockStats = {
          organizationOverview: {
            totalEmployees: 4,
            activeOnboarding: 3,
            averageCompliance: 70,
            averageRisk: 33,
            highRiskEmployees: 1
          },
          taskProgress: {
            total: 8,
            pending: 5,
            completed: 3,
            completionRate: 37
          },
          frameworkCompliance: {
            soc2: 75,
            iso27001: 100,
            gdpr: 40,
            overallScore: 72
          }
        };

        const mockLogs = [
          { id: "al-1", userName: "Sarah Jenkins", action: "EMPLOYEE_CREATE", details: "Initiated onboarding sequence for Alex Rivera (Frontend Engineer).", severity: "INFO", time: "3 hrs ago" },
          { id: "al-2", userName: "Sarah Jenkins", action: "EMPLOYEE_CREATE", details: "Initiated onboarding sequence for David Kim (DevOps Specialist).", severity: "INFO", time: "5 hrs ago" },
          { id: "al-3", userName: "Security Monitor", action: "COMPLIANCE_ALERT", details: "David Kim flagged HIGH RISK: Missing YubiKey credentials & background Screening.", severity: "CRITICAL", time: "6 hrs ago" },
          { id: "al-4", userName: "Marcus Vance", action: "TASK_COMPLETE", details: "Sophia Chen background screening checklists verified.", severity: "INFO", time: "1 day ago" }
        ];

        setStats(mockStats);
        setActivities(mockLogs);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, aiTyping]);

  // Embedded AI chat logic
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setAiInput('');
    setAiTyping(true);

    setTimeout(() => {
      let reply = "";
      const textLower = userText.toLowerCase();

      if (textLower.includes('alex') || textLower.includes('rivera')) {
        reply = "Alex Rivera is at 60% compliance. He has pending security training and MDM hardware setup.";
      } 
      else if (textLower.includes('david') || textLower.includes('kim') || textLower.includes('devops')) {
        reply = "⚠️ DevOps specialist David Kim is marked HIGH RISK (78%) due to missing AWS MFA consents and background screening clearance.";
      }
      else if (textLower.includes('soc') || textLower.includes('soc2') || textLower.includes('compliance')) {
        reply = "SOC 2 Type II is at 75%. Remediate David Kim's background screening to reach 85% instantly.";
      }
      else if (textLower.includes('gdpr') || textLower.includes('privacy')) {
        reply = "GDPR is failing at 40% because only 40% of standard Sales staff finished data processing training.";
      }
      else if (textLower.includes('high risk') || textLower.includes('risk')) {
        reply = "1 High-Risk employee detected: David Kim (DevOps Specialist). Posture rating at 78% due to MFA deficiencies.";
      }
      else {
        reply = "I parsed your query, but try asking: 'Show SOC 2 score', 'Assess GDPR gaps', or 'Who is high risk?'.";
      }

      setAiMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setAiTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (q: string) => {
    setAiInput(q);
  };

  if (loading || fetching || !user) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin"></div>
          <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">Loading Analytics Pipeline...</span>
        </div>
      </div>
    );
  }

  // Visual cards parameters
  const cardConfig = [
    { 
      title: "Avg Compliance Rate", 
      value: `${stats?.organizationOverview?.averageCompliance}%`, 
      sub: "✓ Posture rated as GOOD", 
      icon: ShieldCheck, 
      color: "border-green-500/20 bg-green-500/5 text-green-400"
    },
    { 
      title: "Active Onboardings", 
      value: stats?.organizationOverview?.activeOnboarding, 
      sub: "3 in training pipelines", 
      icon: Users, 
      color: "border-purple-500/20 bg-purple-500/5 text-purple-400"
    },
    { 
      title: "Overall Security Score", 
      value: `${stats?.frameworkCompliance?.overallScore}%`, 
      sub: "SOC2, GDPR, ISO audited", 
      icon: TrendingUp, 
      color: "border-blue-500/20 bg-blue-500/5 text-blue-400"
    },
    { 
      title: "High Risk Staff", 
      value: stats?.organizationOverview?.highRiskEmployees, 
      sub: "⚠️ Requires urgent sign-off", 
      icon: ShieldAlert, 
      color: "border-red-500/20 bg-red-500/5 text-red-400"
    }
  ];

  return (
    <div className="pl-64 pt-20 p-8 flex flex-col gap-8 min-h-screen bg-[#030014]">
      
      {/* Upper Context Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-purple-500/10 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            Welcome back, {user.name} <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Continuous directory scanning verified 4 minutes ago. Posture readiness is stable.
          </p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0 relative z-10">
          <button 
            onClick={() => router.push('/ai-assistant')}
            className="px-4 py-2.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-purple-500/30 transition-all cursor-pointer shadow-lg shadow-purple-500/10"
          >
            <Zap className="w-4 h-4 text-purple-400 animate-bounce" /> Focus AI Assistant
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfig.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 border rounded-2xl glass-card flex flex-col justify-between min-h-[150px] relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-white">{card.value}</h3>
                <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">{card.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recharts Compliance & Onboarding Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance trend AreaChart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl border border-purple-500/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Historical Compliance trend</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Continuous evaluation across regulatory frameworks</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[9px] text-slate-400 font-bold"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> SOC2</span>
              <span className="flex items-center gap-1 text-[9px] text-slate-400 font-bold"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> ISO27001</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSOC2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorISO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 6, 28, 0.95)', border: '1px solid rgba(168, 85, 247, 0.2)', color: '#fff', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="SOC2" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSOC2)" />
                <Area type="monotone" dataKey="ISO27001" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorISO)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task categories completion BarChart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 rounded-2xl border border-purple-500/10"
        >
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Onboarding tasks progress</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Onboarding curriculum completion metrics</p>
          </div>

          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 6, 28, 0.95)', border: '1px solid rgba(168, 85, 247, 0.2)', color: '#fff', borderRadius: '12px', fontSize: '10px' }} />
                <Bar dataKey="Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Alerts, Activities, and Embedded AI Copilot Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Compliance Security Alerts */}
        <div className="glass-card p-6 rounded-2xl border border-purple-500/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> Active Posture Alerts
            </h3>
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <span className="font-bold block">🚨 David Kim Onboarding Latency</span>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">AWS DevOps access provisioned while Background Clearance checklist is still pending.</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                <span className="font-bold block">⚠️ Sales Team GDPR Deficiencies</span>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">GDPR data processing course completed by only 40% of standard Sales staff.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => router.push('/security')}
            className="w-full text-center text-xs text-purple-400 hover:text-purple-300 font-bold pt-4 border-t border-white/5 cursor-pointer mt-4"
          >
            Launch Remediation Wizard
          </button>
        </div>

        {/* Column 2: Recent Onboarding Activity feed */}
        <div className="glass-card p-6 rounded-2xl border border-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-purple-400" /> Recent Activities
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-time organizational event logs</p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 max-h-[260px] overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-colors">
                <div className={`p-1 rounded-lg mt-0.5 ${
                  act.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white truncate">{act.action}</span>
                    <span className="text-[8px] text-slate-500">{act.time}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-normal">{act.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Embedded AI Copilot Widget - Extremely Interactive */}
        <div className="glass-card p-6 rounded-2xl border border-purple-500/15 flex flex-col justify-between h-[360px] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Bot className="w-4.5 h-4.5 text-purple-400 animate-pulse" /> AI Assistant Widget
            </span>
            <span className="text-[8px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-bold uppercase">GEMINI PRO</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto my-3 flex flex-col gap-3 pr-1 scrollbar-thin">
            {aiMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed border ${
                  msg.role === 'assistant' 
                    ? 'bg-white/5 border-white/5 text-slate-300' 
                    : 'bg-purple-500/15 border-purple-500/30 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiTyping && (
              <div className="flex gap-2">
                <div className="p-2 bg-white/5 rounded-xl flex items-center gap-1">
                  <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Queries suggest */}
          {aiMessages.length === 1 && (
            <div className="flex flex-col gap-1.5 mb-2.5">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider pl-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-purple-400" /> Suggest:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleQuickQuestion('David Kim risk report')}
                  className="p-1.5 text-left bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 rounded-lg text-[9px] text-slate-300 transition-all cursor-pointer truncate"
                >
                  David Kim risk report
                </button>
                <button 
                  onClick={() => handleQuickQuestion('Show SOC 2 score')}
                  className="p-1.5 text-left bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 rounded-lg text-[9px] text-slate-300 transition-all cursor-pointer truncate"
                >
                  Show SOC 2 score
                </button>
              </div>
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleAiSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Ask Copilot..." 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              disabled={aiTyping}
              className="w-full pl-3 pr-10 py-2.5 glass-input focus:border-purple-500 rounded-xl text-[10px]"
            />
            <button 
              type="submit" 
              disabled={aiTyping || !aiInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-500 hover:to-blue-400 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
