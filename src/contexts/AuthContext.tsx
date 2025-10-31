'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<User>;
  register: (fullName: string, phoneNumber: string, email: string | undefined, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
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
          // Allow any authenticated user (admin or regular user)
          if (user) {
            setUser(user);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch {
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
      
      // Allow any authenticated user (admin or regular user)
      if (user) {
        localStorage.setItem('adminToken', response.token);
        setUser(user);
        return user;
      } else {
        throw new Error('Failed to authenticate user.');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName: string, phoneNumber: string, email: string | undefined, password: string, confirmPassword: string) => {
    try {
      await authAPI.register(fullName, phoneNumber, email, password, confirmPassword);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
