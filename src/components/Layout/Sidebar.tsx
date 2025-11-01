'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  AcademicCapIcon,
  CogIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Events', href: '/events', icon: CalendarIcon },
  { name: 'Formations', href: '/formations', icon: AcademicCapIcon },
  { name: 'Services', href: '/services', icon: CogIcon },
  { name: 'Communities', href: '/communities', icon: BuildingOfficeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleEditProfile = () => {
    setIsDropdownOpen(false)
    router.push('/profile/edit')
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    logout()
  }

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
          const isActive = pathname === item.href
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
              {isActive && <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>}
            </Link>
          )
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-neutral-100">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full mb-4 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-xs">
                  {user?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email || 'admin@campus-teranga.com'}
                </p>
              </div>
              <ChevronDownIcon
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
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
          )}
        </div>
      </div>
    </div>
  )
}
