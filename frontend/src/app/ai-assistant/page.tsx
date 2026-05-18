'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Terminal,
  HelpCircle,
  Clock,
  ArrowRight,
  Plus,
  MessageSquare,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { token, loading, user } = useAuth();
  const router = useRouter();

  // Chat History Sidebar State
  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [sessions, setSessions] = useState([
    { id: 'session-1', title: 'SOC 2 Gap Audit', time: 'Active' },
    { id: 'session-2', title: 'Alex Rivera Access Check', time: '2 hrs ago' },
    { id: 'session-3', title: 'GDPR Sales Training Gap', time: '5 hrs ago' },
    { id: 'session-4', title: 'David Kim DevOps Flag', time: 'Yesterday' }
  ]);

  // Chat Thread State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions config
  const suggestions = [
    { text: "How is Alex Rivera doing?", label: "Alex Rivera Profile", desc: "Check HR task list status" },
    { text: "List high risk employees", label: "Risk Assessment", desc: "Find infrastructure security gaps" },
    { text: "Show SOC 2 readiness score", label: "SOC 2 Audit", desc: "View control failures & compliance" },
    { text: "Assess GDPR compliance gaps", label: "GDPR Report", desc: "Check sales training completion" }
  ];

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [token, loading, router]);

  useEffect(() => {
    // Add welcome message from AI on load or session change
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I am your **OnboardIQ AI Assistant**. I monitor employee onboarding compliance pipelines and evaluate security posture in real-time.
        \n\nHere are some operations you can command me to perform:
        \n- *"How is Alex Rivera's onboarding going?"*
        \n- *"Show me our SOC 2 compliance readiness"*
        \n- *"List high risk employees"*
        \n- *"Assess GDPR compliance gaps"*
        \n\nHow can I help protect your enterprise's compliance posture today?`,
        timestamp: new Date()
      }
    ]);
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Start new clean chat session
  const handleNewChat = () => {
    const newId = `session-${Math.random()}`;
    setSessions(prev => [
      { id: newId, title: 'New Conversation', time: 'Just now' },
      ...prev
    ]);
    setActiveSessionId(newId);
  };

  // Simulate streaming response
  const triggerStreamingResponse = (promptText: string) => {
    setIsTyping(true);
    
    // Add user message
    const userMsgId = Math.random().toString();
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: promptText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Update active session title based on prompt
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId && s.title === 'New Conversation') {
        return { ...s, title: promptText.length > 22 ? promptText.substring(0, 20) + '...' : promptText };
      }
      return s;
    }));

    // Backend context simulator
    setTimeout(() => {
      let responseText = "";
      const msgLower = promptText.toLowerCase();

      if (msgLower.includes('alex') || msgLower.includes('rivera')) {
        responseText = `**Alex Rivera** is currently in the **ONBOARDING** stage with a **60%** compliance score. 
        \n\nHis security risk profile is low/moderate (**35%**). 
        \n\nHe has **2 pending onboarding tasks**:
        \n- **Complete Security Awareness Training** (TRAINING)
        \n- **Provision MDM & Laptop Setup** (IT_SETUP)
        \n\nTo improve his compliance posture, I suggest reminding him to complete his *Security Awareness Training* which is due soon.`;
      } 
      else if (msgLower.includes('david') || msgLower.includes('kim') || msgLower.includes('devops')) {
        responseText = `⚠️ **Critical Security Flag detected for David Kim** (DevOps Specialist):
        \n- **Compliance Score**: 40%
        \n- **Risk Score**: 78% (HIGH RISK)
        \n\n**Outstanding High-Severity Vulnerabilities**:
        \n1. *AWS IAM & MFA Policy Consent* - Missing (Infrastructure Access danger)
        \n2. *Background Screening Clearance* - Processing delayed
        \n\n**Recommendation**: Since DevOps engineers possess root configuration permissions for AWS production infrastructure, company protocol dictates immediate suspension of further credential provisioning until his background check clears and MFA compliance is signed.`;
      }
      else if (msgLower.includes('soc') || msgLower.includes('soc2') || msgLower.includes('compliance')) {
        responseText = `🔒 **OnboardIQ AI Security & SOC 2 Compliance Report:**
        \nOur organization's live **SOC 2 readiness score is currently at 75%**.
        \n\n**Current Gaps Blocking Compliance:**
        \n- **Security Training Audits**: 2 new hires have not finalized their Security Awareness checklists.
        \n- **Background Checks**: David Kim (DevOps) is active in system setup without fully verified background clearance (Severity: Critical).
        \n- **Device Encryption**: All other active devices are compliant at 95% MDM coverage.
        \n\n**Action Items**:
        \n1. Enforce background check clearance for DevOps hires.
        \n2. Automate notifications to pending training employees.`;
      }
      else if (msgLower.includes('gdpr') || msgLower.includes('privacy') || msgLower.includes('eu')) {
        responseText = `🇪🇺 **GDPR Readiness Report:**
        \nOur organization's live **GDPR compliance score is currently at 40% (FAILING/WARNING STATUS)**.
        \n\n**Primary Issues Detected:**
        \n- Multiple customer-facing team members in the Sales department have skipped the *Customer Data Processing & GDPR Training* modules.
        \n- Background check validation latency is causing policy breaches.
        \n\n**Remediation**:
        \nI recommend launching an automated campaign to enforce the GDPR compliance curriculum for the Sales team immediately.`;
      }
      else if (msgLower.includes('high risk') || msgLower.includes('risk') || msgLower.includes('danger')) {
        responseText = `⚠️ **Security Alert: Live Risk Profile Summary**
        \nI detected **1 High-Risk employee** with pending high-severity security tasks.
        \n\n- **David Kim** (DevOps Specialist - Engineering)
        \n  - Risk Score: **78%** (due to missing critical infrastructure security tasks)
        \n  - Pending: AWS IAM & MFA Policy Consent, Background Screening Clearance
        \n\nWould you like me to draft automated Slack/Email alerts to these employees to enforce security compliance immediately?`;
      }
      else {
        responseText = `I am your specialized **OnboardIQ AI Onboarding Assistant**.
        \n\nI can analyze our active database and give specific compliance updates. 
        \nTo get started, try asking about one of our active profiles:
        \n- *"How is Alex Rivera's onboarding going?"*
        \n- *"Show me our SOC 2 compliance readiness"*
        \n- *"List high risk employees"*
        \n- *"Assess GDPR compliance gaps"*`;
      }

      // Add empty assistant message
      const assistantMsgId = Math.random().toString();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      // Stream the words to perfectly simulate ChatGPT standard streams
      const words = responseText.split(' ');
      let currentWordIdx = 0;
      let currentString = "";

      const interval = setInterval(() => {
        if (currentWordIdx < words.length) {
          const chunk = words.slice(currentWordIdx, currentWordIdx + 3).join(' ') + ' ';
          currentString += chunk;
          
          setMessages(prev => prev.map(m => {
            if (m.id === assistantMsgId) {
              return { ...m, content: currentString };
            }
            return m;
          }));
          currentWordIdx += 3;
        } else {
          clearInterval(interval);
        }
      }, 40);

    }, 1000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    triggerStreamingResponse(input);
  };

  const handleSuggestionClick = (promptText: string) => {
    triggerStreamingResponse(promptText);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pl-64 pt-20 flex h-screen bg-[#030014] overflow-hidden text-slate-100">
      
      {/* 1. Page-Level Left AI Chat History Sidebar */}
      <aside className="w-68 border-r border-white/5 bg-[#080518]/60 flex flex-col justify-between p-4 z-10">
        <div className="flex flex-col gap-6">
          
          {/* New Chat Button */}
          <button 
            onClick={handleNewChat}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600/20 to-blue-500/10 border border-purple-500/30 hover:border-purple-500/60 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 text-purple-400" /> Start New Session
          </button>

          {/* Sessions List */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest px-2 mb-1">Recent Conversations</span>
            
            <div className="flex flex-col gap-1 max-h-[420px] overflow-y-auto pr-1">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all text-xs cursor-pointer ${
                      isActive 
                        ? 'bg-purple-500/10 border border-purple-500/20 text-white font-bold' 
                        : 'bg-transparent hover:bg-white/5 border border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <MessageSquare className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                      <span className="truncate">{s.title}</span>
                    </div>
                    <span className="text-[8px] text-slate-500 flex-shrink-0 font-medium ml-1.5">{s.time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lower Model Specifications */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600/20 p-1.5 rounded-lg">
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] text-white font-bold block">Gemini 1.5 Pro</span>
              <span className="text-[8px] text-green-400 font-extrabold uppercase">Live Sync active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main AI Chat Panel */}
      <section className="flex-1 flex flex-col justify-between h-full bg-[#030014] relative">
        
        {/* Floating Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-4 bg-[#030014]/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">Continuous Posture Guard</h2>
              <span className="text-[9px] text-slate-500 block mt-0.5">Directory & Framework audits synced</span>
            </div>
          </div>
        </div>

        {/* Messages Stream Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-3xl ${isAI ? '' : 'self-end flex-row-reverse'}`}
              >
                {/* Visual Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  isAI ? 'bg-purple-600 glow-purple text-white' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                }`}>
                  {isAI ? <Bot className="w-5 h-5 text-white" /> : 'U'}
                </div>

                {/* Message Body Panel */}
                <div className={`p-4 rounded-2xl text-xs leading-relaxed border relative ${
                  isAI 
                    ? 'glass-card border-purple-500/10 text-slate-200' 
                    : 'bg-purple-500/10 border-purple-500/30 text-white'
                }`}>
                  <div className="whitespace-pre-line flex flex-col gap-2.5">
                    {msg.content.split('\n').map((para, pIdx) => {
                      if (para.includes('**')) {
                        const parts = para.split('**');
                        return (
                          <p key={pIdx}>
                            {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className="text-white font-extrabold">{p}</strong> : p)}
                          </p>
                        );
                      }
                      return <p key={pIdx}>{para}</p>;
                    })}
                  </div>
                  
                  <span className="text-[8px] text-slate-500 block mt-2 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* typing bouncing animation */}
          {isTyping && (
            <div className="flex gap-4 max-w-xl">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl glass-card border border-purple-500/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries - ChatGPT Style Landing */}
        {messages.length <= 1 && !isTyping && (
          <div className="max-w-4xl mx-auto w-full px-6 mb-6">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Recommended audits:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(s.text)}
                  className="p-4 text-left bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 rounded-2xl transition-all cursor-pointer flex flex-col gap-1 hover:scale-[1.01]"
                >
                  <span className="text-[9px] text-purple-400 font-extrabold uppercase tracking-wider">{s.label}</span>
                  <span className="text-xs text-slate-200 mt-0.5">{s.text}</span>
                  <span className="text-[9px] text-slate-500">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input prompt field bar */}
        <div className="p-6 bg-[#030014]">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              placeholder="Query organizational database (e.g. 'Identify GDPR compliance gaps'...)" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              className="w-full pl-4 pr-16 py-4.5 glass-input focus:border-purple-500 rounded-2xl text-xs focus:ring-1 focus:ring-purple-500/40"
            />
            <button 
              type="submit"
              disabled={isTyping || !input.trim()}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:from-purple-500 hover:to-blue-400 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <span className="text-[8px] text-slate-600 block text-center mt-3">
            OnboardIQ AI monitors live data. Core compliance recommendations should be verified by operational personnel.
          </span>
        </div>

      </section>
    </div>
  );
}
