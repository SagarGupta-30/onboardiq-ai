'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  X, 
  Check, 
  FolderLock,
  ChevronRight,
  TrendingDown,
  Info,
  Upload,
  FileText,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeesPage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  
  // Data State
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Upload Form State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any[]>>({
    "emp-1": [
      { name: "NDA_Signed_Rivera.pdf", size: "324 KB", date: "Today", status: "VERIFIED" }
    ],
    "emp-2": [
      { name: "Background_Check_Clearance.pdf", size: "1.2 MB", date: "Yesterday", status: "PENDING" }
    ]
  });

  // New Employee Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Frontend Engineer');
  const [startDate, setStartDate] = useState('');

  // Initial Mock Database
  const mockEmployees = [
    {
      id: "emp-1",
      firstName: "Alex",
      lastName: "Rivera",
      email: "alex.rivera@onboardiq-client.com",
      department: "Engineering",
      role: "Frontend Engineer",
      status: "ONBOARDING",
      startDate: "2026-05-23",
      riskScore: 35,
      complianceScore: 60,
      tasks: [
        { id: "t1", title: "Sign NDA & Code of Conduct", description: "Review and sign the company confidentiality agreements and code of conduct document.", category: "DOCUMENT", status: "COMPLETED", completedAt: new Date() },
        { id: "t2", title: "Complete Security Awareness Training", description: "Complete the initial 45-minute baseline security awareness course and pass the assessment quiz.", category: "TRAINING", status: "PENDING", completedAt: null },
        { id: "t3", title: "Provision MDM & Laptop Setup", description: "Install corporate mobile device management agent and set up hard drive encryption (FileVault).", category: "IT_SETUP", status: "PENDING", completedAt: null }
      ]
    },
    {
      id: "emp-2",
      firstName: "Sophia",
      lastName: "Chen",
      email: "sophia.chen@onboardiq-client.com",
      department: "Product",
      role: "Product Manager",
      status: "ONBOARDING",
      startDate: "2026-05-20",
      riskScore: 12,
      complianceScore: 80,
      tasks: [
        { id: "t4", title: "Sign NDA & Code of Conduct", description: "Review and sign the company confidentiality agreements and code of conduct document.", category: "DOCUMENT", status: "COMPLETED", completedAt: new Date() },
        { id: "t5", title: "Verify Background Check", description: "Submit documentation for compliance verification via background check portal.", category: "SECURITY", status: "COMPLETED", completedAt: new Date() },
        { id: "t6", title: "Configure 2FA on Password Manager", description: "Complete setup for corporate 1Password account and enforce multi-factor authentication.", category: "SECURITY", status: "PENDING", completedAt: null }
      ]
    },
    {
      id: "emp-3",
      firstName: "Jordan",
      lastName: "Smith",
      email: "jordan.smith@onboardiq-client.com",
      department: "Sales",
      role: "Enterprise Account Executive",
      status: "ACTIVE",
      startDate: "2026-04-18",
      riskScore: 8,
      complianceScore: 100,
      tasks: [
        { id: "t-j1", title: "Sign NDA & Code of Conduct", description: "NDA document complete.", category: "DOCUMENT", status: "COMPLETED", completedAt: new Date() },
        { id: "t-j2", title: "GDPR privacy training", description: "Sales data training complete.", category: "TRAINING", status: "COMPLETED", completedAt: new Date() }
      ]
    },
    {
      id: "emp-4",
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@onboardiq-client.com",
      department: "Engineering",
      role: "DevOps Specialist",
      status: "ONBOARDING",
      startDate: "2026-05-19",
      riskScore: 78,
      complianceScore: 40,
      tasks: [
        { id: "t7", title: "AWS IAM & MFA Policy Consent", description: "Acknowledge least-privilege policies and register hardware security key (YubiKey) for cloud consoles.", category: "SECURITY", status: "PENDING", completedAt: null },
        { id: "t8", title: "Background Screening Clearance", description: "Criminal record and identity verification check for high-privilege access authorization.", category: "SECURITY", status: "PENDING", completedAt: null }
      ]
    }
  ];

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [token, loading, router]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetching(true);
        const data = await apiFetch('/api/employees');
        setEmployees(data);
      } catch (err) {
        console.warn('[Employees API Fallback] Failed connecting to backend API, falling back to local mocks:', err);
        setEmployees(mockEmployees);
      } finally {
        setFetching(false);
      }
    };

    if (token) {
      fetchEmployees();
    }
  }, [token]);

  // Recalculate scores helper
  const updateLocalTaskStatus = async (empId: string, taskId: string, newStatus: 'PENDING' | 'COMPLETED') => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id !== empId) return emp;
      
      const updatedTasks = emp.tasks.map((t: any) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === 'COMPLETED' ? new Date() : null
        };
      });

      const completed = updatedTasks.filter((t: any) => t.status === 'COMPLETED').length;
      const compScore = Math.round((completed / updatedTasks.length) * 100);
      
      let baseRisk = 50;
      if (emp.department === "Engineering") baseRisk = 70;
      if (emp.department === "Sales") baseRisk = 30;
      const risk = Math.max(5, Math.min(95, Math.round(baseRisk * (1 - (compScore / 100)))));

      return {
        ...emp,
        tasks: updatedTasks,
        complianceScore: compScore,
        riskScore: risk,
        status: compScore === 100 ? 'ACTIVE' : 'ONBOARDING'
      };
    });

    setEmployees(updatedEmployees);
    const nextSelected = updatedEmployees.find(e => e.id === empId);
    setSelectedEmp(nextSelected);

    try {
      await apiFetch(`/api/employees/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn('[Employees Task API Fallback] Local state updated, backend sync skipped:', err);
    }
  };

  // Add employee handler
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !startDate) return;

    let baseRisk = 25;
    if (department === 'Engineering') baseRisk = 65;

    const tempId = `emp-${Math.random().toString(36).substr(2, 9)}`;
    const newEmpPlaceholder = {
      id: tempId,
      firstName,
      lastName,
      email,
      department,
      role,
      status: "ONBOARDING",
      startDate,
      riskScore: baseRisk,
      complianceScore: 0,
      tasks: [
        { id: `t-n1-${Math.random()}`, title: "Sign NDA & Code of Conduct", description: "Sign confidentiality and code of conduct statement.", category: "DOCUMENT", status: "PENDING", completedAt: null },
        { id: `t-n2-${Math.random()}`, title: "Complete Security Awareness Training", description: "Baseline LMS security training modules.", category: "TRAINING", status: "PENDING", completedAt: null },
        { id: `t-n3-${Math.random()}`, title: "Enforce MDM Device Encryption", description: "Configure corporate laptop with disk encryption rules.", category: "IT_SETUP", status: "PENDING", completedAt: null }
      ]
    };

    setEmployees([newEmpPlaceholder, ...employees]);
    setShowAddModal(false);

    try {
      const savedEmp = await apiFetch('/api/employees', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          department,
          role,
          startDate
        })
      });
      setEmployees(prev => prev.map(emp => emp.id === tempId ? savedEmp : emp));
    } catch (err) {
      console.warn('[Employees Provision API Fallback] Local placeholder kept, backend sync skipped:', err);
    }

    // Reset Form
    setFirstName('');
    setLastName('');
    setEmail('');
    setStartDate('');
  };

  // Simulated document upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedEmp) return;
    const file = e.target.files[0];
    
    setIsUploading(true);

    setTimeout(() => {
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: "Just now",
        status: "PENDING"
      };

      setUploadedFiles(prev => ({
        ...prev,
        [selectedEmp.id]: [newFile, ...(prev[selectedEmp.id] || [])]
      }));

      setIsUploading(false);
    }, 1200);
  };

  const handleFileDelete = (empId: string, fileIdx: number) => {
    setUploadedFiles(prev => {
      const files = [...(prev[empId] || [])];
      files.splice(fileIdx, 1);
      return {
        ...prev,
        [empId]: files
      };
    });
  };

  // Filter logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) || 
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = deptFilter === 'ALL' || emp.department.toUpperCase() === deptFilter;
    return matchesSearch && matchesDept;
  });

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const currentEmpFiles = selectedEmp ? (uploadedFiles[selectedEmp.id] || []) : [];

  return (
    <div className="pl-64 pt-20 p-8 flex flex-col gap-8 min-h-screen bg-[#030014]">
      
      {/* Header action panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">Workforce Compliance Pipeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">Provision onboarding checklists, track certifications, and enforce audits.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/15 cursor-pointer hover:scale-[1.02] transition-all"
        >
          <UserPlus className="w-4 h-4" /> Provision Employee
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search employee, email, role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs glass-input focus:border-purple-500"
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'ENGINEERING', 'PRODUCT', 'SALES'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3.5 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wide border transition-all cursor-pointer ${
                deptFilter === dept 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 glow-purple' 
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Table / Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Table Listing */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-purple-500/10 overflow-hidden shadow-xl">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Employee</th>
                <th className="p-4">Department & Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Compliance</th>
                <th className="p-4">Risk Profile</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => setSelectedEmp(emp)}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                      selectedEmp?.id === emp.id ? 'bg-purple-500/5' : ''
                    }`}
                  >
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-inner">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{emp.firstName} {emp.lastName}</span>
                        <span className="text-[10px] text-slate-500 block">{emp.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white block font-medium">{emp.role}</span>
                      <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">{emp.department}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        emp.status === 'ACTIVE' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${emp.complianceScore}%` }}></div>
                        </div>
                        <span className="font-extrabold text-white text-[11px]">{emp.complianceScore}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        emp.riskScore > 50 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/25 glow-red' 
                          : 'bg-green-500/10 text-green-400 border border-green-500/25'
                      }`}>
                        {emp.riskScore > 50 ? <ShieldAlert className="w-3 h-3 animate-pulse" /> : <ShieldCheck className="w-3 h-3" />}
                        {emp.riskScore}%
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No matching employees found in current pipeline.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Employee Checklist details panel & Document Uploader */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {selectedEmp ? (
            <motion.div 
              key={selectedEmp.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl border border-purple-500/15 p-6 flex flex-col gap-6 relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedEmp.firstName} {selectedEmp.lastName}</h3>
                  <span className="text-[10px] text-slate-400">{selectedEmp.role}</span>
                </div>
                <button 
                  onClick={() => setSelectedEmp(null)}
                  className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Widget */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Compliance</span>
                  <div className="text-lg font-extrabold text-purple-400 mt-1">{selectedEmp.complianceScore}%</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Security Risk</span>
                  <div className={`text-lg font-extrabold mt-1 ${selectedEmp.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>
                    {selectedEmp.riskScore}%
                  </div>
                </div>
              </div>

              {/* Checklist list */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Tasks</span>
                <div className="flex flex-col gap-2.5 max-h-[190px] overflow-y-auto pr-1">
                  {selectedEmp.tasks.map((t: any) => {
                    const isCompleted = t.status === 'COMPLETED';
                    return (
                      <div key={t.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 hover:bg-white/10 transition-colors justify-between items-center">
                        <div className="overflow-hidden">
                          <span className="text-xs font-bold text-white block truncate">{t.title}</span>
                          <span className="text-[9px] text-purple-400 font-extrabold uppercase mt-1 block tracking-wider">{t.category}</span>
                        </div>

                        <button
                          onClick={() => updateLocalTaskStatus(selectedEmp.id, t.id, isCompleted ? 'PENDING' : 'COMPLETED')}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all cursor-pointer ${
                            isCompleted 
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300 hover:bg-purple-500/30 animate-pulse' 
                              : 'bg-white/5 border-white/10 text-slate-500 hover:border-purple-500/30 hover:text-white'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Document upload box */}
              <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Compliance Documentation</span>
                
                {/* Upload Trigger Area */}
                <div className="relative border border-dashed border-white/15 hover:border-purple-500/40 rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-white/5">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                        <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wide">Syncing file securely...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 animate-pulse" />
                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wide">Drag & Drop Document</span>
                        <span className="text-[8px] text-slate-500">PDF, PNG, DOC (Max 5MB)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Uploaded Documents List */}
                {currentEmpFiles.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest pl-1">Uploaded Logs ({currentEmpFiles.length})</span>
                    <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                      {currentEmpFiles.map((file, idx) => (
                        <div key={idx} className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <span className="text-[9px] text-white font-bold block truncate">{file.name}</span>
                              <span className="text-[8px] text-slate-500 block leading-none">{file.size} • {file.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              file.status === 'VERIFIED' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {file.status}
                            </span>
                            <button 
                              onClick={() => handleFileDelete(selectedEmp.id, idx)}
                              className="p-1 rounded bg-transparent hover:bg-white/5 text-slate-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl border border-purple-500/10 p-8 text-center text-slate-500 flex flex-col items-center gap-3">
              <Info className="w-8 h-8 text-purple-400/50 animate-pulse" />
              <span className="text-xs font-bold">No Employee selected</span>
              <p className="text-[10px] text-slate-400 mt-1">Select an employee from the list to view customized onboarding checklists and sign off outstanding compliance tasks.</p>
            </div>
          )}
        </div>

      </div>

      {/* Provision Employee Animated Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-[#030014]/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              {/* Form Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg glass-card border border-purple-500/20 p-8 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-purple-400" /> Provision Employee & Posture
                  </h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddEmployee} className="grid grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Alex" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Rivera" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Corporate Email</label>
                    <input 
                      type="email" 
                      placeholder="alex.rivera@company.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Department</label>
                    <select 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500 appearance-none bg-[#0c0924] cursor-pointer"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Corporate Role</label>
                    <input 
                      type="text" 
                      placeholder="Frontend Engineer" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 text-xs glass-input focus:border-purple-500 cursor-pointer"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="col-span-2 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl mt-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  >
                    Provision & Generate Checklists
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
