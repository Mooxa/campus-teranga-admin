'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  AcademicCapIcon, 
  CogIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Events', href: '/events', icon: CalendarIcon },
  { name: 'Formations', href: '/formations', icon: AcademicCapIcon },
  { name: 'Services', href: '/services', icon: CogIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-72 bg-neutral-0 border-r border-neutral-200">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-neutral-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">CT</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">Campus Téranga</h1>
            <p className="text-xs text-neutral-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <item.icon 
                className={`w-5 h-5 mr-3 transition-colors ${
                  isActive ? 'text-orange-600' : 'text-neutral-400 group-hover:text-neutral-600'
                }`} 
              />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-neutral-100">
        <div className="mb-4 p-3 bg-neutral-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-xs">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">Admin User</p>
              <p className="text-xs text-neutral-500 truncate">admin@campus-teranga.com</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-3 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 group"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
