
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/navigation'
import { LoadingSpinner } from '@/components/loading-spinner';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>; // pass is unused for mock
  signup: (email: string, pass: string, name?:string) => Promise<void>; // pass is unused for mock
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Try to load user from localStorage on initial load
    try {
      const storedUser = localStorage.getItem('petpalUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('petpalUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, _: string): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: 'mock-user-id-' + Date.now(), email, name: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('petpalUser', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const signup = async (email: string, _: string, name?: string): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: 'mock-user-id-' + Date.now(), email, name: name || email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('petpalUser', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('petpalUser');
    router.push('/login');
  };

  if (loading && typeof window !== 'undefined' && !localStorage.getItem('petpalUser')) {
     // Don't show global spinner if we know user is not logged in and we're on client
     // This initial loading is more about checking localStorage
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
