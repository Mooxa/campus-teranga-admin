'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { BellIcon, MagnifyingGlassIcon, UserIcon, ArrowRightOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    router.push('/profile/edit');
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className="bg-neutral-0 border-b border-neutral-200">
      <div className="flex items-center justify-between px-8 py-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Welcome back, {user?.fullName}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all duration-200">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 pl-4 border-l border-neutral-200 hover:bg-neutral-50 rounded-lg px-3 py-2 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="text-sm text-left">
                <div className="font-medium text-neutral-900">{user?.fullName}</div>
                <div className="text-neutral-500 capitalize">{user?.role?.replace('_', ' ')}</div>
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.fullName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{user?.fullName}</div>
                      <div className="text-sm text-neutral-500">{user?.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center w-full px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                  >
                    <UserIcon className="w-5 h-5 mr-3 text-neutral-400" />
                    <span>Modifier le profil</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-400" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
