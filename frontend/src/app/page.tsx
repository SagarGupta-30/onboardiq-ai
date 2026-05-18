'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Bot, 
  Users, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Fingerprint,
  Cpu,
  Lock,
  Globe,
  CheckCircle,
  Activity,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  // Framer Motion Animation Settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 80, damping: 15 } 
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 100 } 
    }
  };

  const features = [
    { 
      icon: Bot, 
      title: "AI Compliance Assistant", 
      desc: "Instant query of SOC2, GDPR, and ISO standards mapped directly to employee security postures.",
      color: "from-purple-500 to-indigo-500",
      badge: "Gemini 1.5 Pro"
    },
    { 
      icon: ShieldCheck, 
      title: "Continuous Risk Scoring", 
      desc: "Evaluates permissions latency, MDM status, and MFA configurations in real time.",
      color: "from-blue-500 to-cyan-500",
      badge: "Real-time"
    },
    { 
      icon: Users, 
      title: "Role-Based Checklists", 
      desc: "Assign Engineering background screenings and DevOps security consent forms automatically.",
      color: "from-purple-600 to-pink-500",
      badge: "Automated"
    },
    { 
      icon: FileText, 
      title: "Audit-Ready Trail Logs", 
      desc: "Comprehensive activity timeline exportable to CSV formats instantly for external auditors.",
      color: "from-blue-600 to-indigo-500",
      badge: "SOC 2 / ISO"
    }
  ];

  const trustedCompanies = [
    { name: "Vercel", icon: Layers },
    { name: "Supabase", icon: Database },
    { name: "Stripe", icon: Globe },
    { name: "Okta", icon: Fingerprint },
    { name: "Cloudflare", icon: Cpu }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030014] text-slate-200">
      {/* Dynamic Grid Background Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0728_1px,transparent_1px),linear-gradient(to_bottom,#0c0728_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Decorative Outer Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none animate-pulse [animation-duration:8s]"></div>

      {/* Glass Navigation Header */}
      <header className="sticky top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-[#030014]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-gradient-to-tr from-purple-600 to-blue-500 p-2.5 rounded-xl flex items-center justify-center glow-purple">
              <Fingerprint className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="font-black text-xl text-white tracking-wider">Onboard<span className="text-purple-400">IQ</span></span>
              <span className="block text-[8px] text-blue-400 font-extrabold uppercase tracking-widest leading-none">Enterprise</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">
              Operator Sign In
            </Link>
            <Link 
              href="/login" 
              className="px-4.5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              Access Console <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Presentation Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 flex flex-col items-center">
        
        {/* Top Glow Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold mb-8 uppercase tracking-widest glow-purple"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Continuous Security & Compliance Platform
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-5xl md:text-7.5xl font-black tracking-tight text-white max-w-5xl leading-[1.08] text-center"
        >
          Automated Onboarding. <br />
          <span className="gradient-text-purple-blue">Continuous AI Compliance.</span>
        </motion.h1>

        {/* Hero Paragraph Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-400 text-base md:text-lg max-w-3xl mt-8 leading-relaxed text-center"
        >
          Evaluate workforce credentials dynamically, enforce SOC 2 and GDPR standards, and monitor active operational risk indices inside a single glassmorphic pipeline.
        </motion.p>

        {/* Action Button Group */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4.5 mt-10"
        >
          <Link 
            href="/login" 
            className="px-8 py-4.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-black text-sm rounded-2xl shadow-2xl shadow-purple-500/25 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-purple-500/30"
          >
            Launch Free Sandbox Pilot <ArrowRight className="w-4.5 h-4.5" />
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-4.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.03]"
          >
            Request Enterprise Demo
          </Link>
        </motion.div>

        {/* Trusted Companies Section - Fully Styled */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-5xl mt-24 text-center"
        >
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-8">
            Enforcing Automated Compliance For High-Growth Teams At
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {trustedCompanies.map((company, idx) => {
              const Icon = company.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={logoVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 + idx * 0.08 }}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer group"
                >
                  <Icon className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  <span className="font-extrabold text-sm tracking-wider uppercase">{company.name}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Interactive Dashboard Mockup Preview - Masterpiece */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          className="w-full max-w-5xl mt-24 relative group"
        >
          {/* Neon Background Glows */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl -z-10 group-hover:opacity-100 transition-opacity opacity-70"></div>
          
          <div className="glass-panel border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* Header Browser Toolbar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/70 border border-red-500/10"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/70 border border-amber-500/10"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/70 border border-green-500/10"></div>
                <div className="bg-white/5 text-[10px] text-slate-400 px-4 py-1.5 rounded-full border border-white/5 ml-4 font-mono">
                  https://app.onboardiq.ai/dashboard
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
                <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">Live Directory Auditing</span>
              </div>
            </div>

            {/* Dashboard Workspace Mock Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              
              {/* Card 1: SOC 2 Score Card */}
              <div className="glass-card p-5 rounded-2xl flex flex-col justify-between min-h-[160px] relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[9px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">SOC2</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SOC 2 Readiness</span>
                  <div className="text-4xl font-black text-white mt-3">75%</div>
                </div>
                <div className="mt-4 border-t border-white/5 pt-3">
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1.5">✓ 2 passed audits, 1 warning flag</span>
                </div>
              </div>

              {/* Card 2: Risk Profile */}
              <div className="glass-card p-5 rounded-2xl flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[9px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">CRITICAL</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Security Risk Index</span>
                  <div className="text-4xl font-black text-white mt-3 text-red-400">78%</div>
                </div>
                <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 italic">David Kim (DevOps) missing MFA</span>
                  <span className="text-[8px] font-bold text-red-400 uppercase">REMEDIATE</span>
                </div>
              </div>

              {/* Card 3: AI Assistant Widget */}
              <div className="glass-card p-5 rounded-2xl flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-400 animate-pulse" /> AI Agent
                  </span>
                  <span className="text-[8px] text-slate-500">Connected</span>
                </div>
                <p className="text-[11px] text-slate-300 italic leading-relaxed mt-2.5">
                  "David Kim holds DevOps keys with pending Background screenings. Suspended further aws authorizations."
                </p>
                <div className="text-[8px] text-purple-400 font-bold uppercase tracking-wider mt-3 flex items-center gap-1">
                  <span>Actions enforced</span> <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid Showcase Section */}
      <section className="max-w-7xl mx-auto px-6 py-28 border-t border-white/5 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1 text-xs text-blue-400 font-extrabold uppercase tracking-widest mb-3"
          >
            <Activity className="w-4.5 h-4.5 animate-pulse" /> Fully Orchestrated Compliance
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Security compliance posture built inside onboarding workflows.
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Provision workforce directory accounts, scan framework checkpoints, and map audit trails dynamically.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="glass-card p-6 rounded-2xl flex flex-col items-start hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group"
              >
                {/* Floating Card Badge */}
                <div className="absolute top-4 right-4 text-[8px] text-slate-500 font-bold uppercase tracking-wide group-hover:text-slate-300 transition-colors">
                  {f.badge}
                </div>

                <div className={`p-3 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center mb-6 glow-purple shadow-lg`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>

                <h3 className="text-sm font-bold text-white mb-2 tracking-wide group-hover:text-purple-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-normal leading-relaxed">{f.desc}</p>
                
                <div className="mt-5 flex items-center gap-1 text-[9px] text-purple-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn about capabilities <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Testimonial / Social Proof Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl glass-card rounded-3xl p-8 md:p-12 border border-purple-500/15 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          
          <span className="text-[9px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-6 inline-block">
            SOC2 CASE STUDY
          </span>

          <blockquote className="text-lg md:text-xl font-bold text-white leading-relaxed max-w-3xl mx-auto">
            "Before OnboardIQ AI, proving our SOC 2 alignment required manual, monthly HR screenings and security credential checking. Today, compliance is continuously verified. Our external auditors approved our posture index in record time."
          </blockquote>

          <div className="mt-8">
            <span className="text-sm font-extrabold text-white block">Devon Vance</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5 block">Chief Information Security Officer (CISO)</span>
          </div>
        </motion.div>
      </section>

      {/* High-Impact Bottom Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 text-center">
        <div className="absolute inset-0 bg-radial-gradient from-purple-500/10 to-transparent blur-3xl -z-10 opacity-70"></div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Ready to automate security compliance?
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-4 max-w-xl mx-auto leading-relaxed">
          Unlock standard access to the complete in-memory sandbox and mock identity dashboards with a single click.
        </p>
        <div className="mt-8 flex justify-center">
          <Link 
            href="/login" 
            className="px-8 py-4.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-purple-500/20"
          >
            Launch Interactive Sandbox Portal <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>

      {/* Premium Multi-Framework Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center text-xs text-slate-500 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full glow-purple"></div>
          <span className="font-extrabold text-slate-300">OnboardIQ AI</span>
          <span className="text-[10px] text-slate-600">| Standard SOC 2 Type II Certified</span>
        </div>

        {/* Regulatory frameworks badges */}
        <div className="flex items-center gap-4 text-[9px] text-slate-600 font-extrabold tracking-widest uppercase">
          <span className="px-2 py-0.5 border border-slate-800 rounded">SOC2 Compliant</span>
          <span className="px-2 py-0.5 border border-slate-800 rounded">GDPR Audited</span>
          <span className="px-2 py-0.5 border border-slate-800 rounded">ISO 27001</span>
        </div>

        <p>© 2026 OnboardIQ AI, Inc. Continuous security monitoring operations. All rights reserved.</p>
      </footer>
    </div>
  );
}
