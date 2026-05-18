'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // 'ADMIN', 'HR', 'EMPLOYEE', 'SECURITY_OFFICER'
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ADMIN_USER: User = {
  id: "u1",
  name: "Sarah Jenkins",
  email: "admin@onboardiq.ai",
  role: "HR"
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Read from localStorage on mount
    const storedToken = localStorage.getItem('onboardiq_token');
    const storedUser = localStorage.getItem('onboardiq_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      // Setup mock admin user for beautiful out-of-the-box experience
      localStorage.setItem('onboardiq_token', 'mock_token_sarah_jenkins_2026');
      localStorage.setItem('onboardiq_user', JSON.stringify(MOCK_ADMIN_USER));
      setToken('mock_token_sarah_jenkins_2026');
      setUser(MOCK_ADMIN_USER);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('onboardiq_token', newToken);
    localStorage.setItem('onboardiq_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('onboardiq_token');
    localStorage.removeItem('onboardiq_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
