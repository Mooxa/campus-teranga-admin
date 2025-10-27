'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (fullName: string, phoneNumber: string, email: string | undefined, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await authAPI.getMe();
          const user = response.user || response;
          if (user && (user.role === 'admin' || user.role === 'super_admin')) {
            setUser(user);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await authAPI.login(phoneNumber, password);
      const user = response.user || response;
      
      if (user && (user.role === 'admin' || user.role === 'super_admin')) {
        localStorage.setItem('adminToken', response.token);
        setUser(user);
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName: string, phoneNumber: string, email: string | undefined, password: string, confirmPassword: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          email: email || undefined,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful - redirect to login
      return;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
