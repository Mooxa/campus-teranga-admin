'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { adminAPI, DashboardStats } from '@/lib/api'
import AdminLayout from '@/components/Layout/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import {
  UsersIcon,
  CalendarIcon,
  AcademicCapIcon,
  CogIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchStats()
    } else if (!isLoading) {
      setLoading(false)
    }
  }, [isAuthenticated, isLoading, user])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [loading])

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getStats()
      setStats(data)
    } catch {
      setStats({
        totalUsers: 0,
        totalEvents: 0,
        totalFormations: 0,
        totalServices: 0,
        totalCommunities: 0,
        activeUsers: 0,
        recentUsers: [],
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-300 animate-pulse"></div>
              </div>
              <p className="text-base font-medium text-neutral-700">Loading dashboard...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">Authentication Required</h3>
              <p className="text-sm text-neutral-600">Please log in to access the dashboard.</p>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      href: '/users',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-200',
      hoverShadow: 'hover:shadow-blue-300',
    },
    {
      name: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserGroupIcon,
      href: '/users',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-200',
      hoverShadow: 'hover:shadow-emerald-300',
    },
    {
      name: 'Events',
      value: stats?.totalEvents || 0,
      icon: CalendarIcon,
      href: '/events',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-200',
      hoverShadow: 'hover:shadow-orange-300',
    },
    {
      name: 'Formations',
      value: stats?.totalFormations || 0,
      icon: AcademicCapIcon,
      href: '/formations',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-200',
      hoverShadow: 'hover:shadow-purple-300',
    },
    {
      name: 'Services',
      value: stats?.totalServices || 0,
      icon: CogIcon,
      href: '/services',
      gradient: 'from-rose-500 to-pink-500',
      bgGradient: 'from-rose-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
      shadowColor: 'shadow-rose-200',
      hoverShadow: 'hover:shadow-rose-300',
    },
    {
      name: 'Communities',
      value: stats?.totalCommunities || 0,
      icon: BuildingOfficeIcon,
      href: '/communities',
      gradient: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-500',
      shadowColor: 'shadow-indigo-200',
      hoverShadow: 'hover:shadow-indigo-300',
    },
  ]

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Animated Header */}
            <div
              className={`mb-8 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </div>
              <p className="text-lg text-neutral-700 ml-12">
                Welcome back, <span className="font-semibold text-purple-600">{user?.fullName || 'Admin'}</span> 👋
              </p>
            </div>

            {/* Animated Stats Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Link
                  key={stat.name}
                  href={stat.href}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 transition-all duration-500 transform hover:-translate-y-2 ${stat.shadowColor} ${stat.hoverShadow} hover:shadow-2xl ${
                    mounted
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`}
                  ></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-600 mb-2 group-hover:text-neutral-800 transition-colors">
                        {stat.name}
                      </p>
                      <p
                        className={`text-4xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-2xl ${stat.iconBg} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Users Section */}
            {stats?.recentUsers && stats.recentUsers.length > 0 && (
              <div
                className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl mb-8 overflow-hidden transition-all duration-700 ${
                  mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '600ms' }}
              >
                <div className="px-6 py-5 border-b border-neutral-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-neutral-900">Recent Users</h2>
                        <p className="text-sm text-neutral-600 mt-0.5">Latest registered users</p>
                      </div>
                    </div>
                    <Link
                      href="/users"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      View all
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-neutral-200/50">
                  {stats.recentUsers.slice(0, 5).map((user, index) => (
                    <div
                      key={user._id}
                      className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => router.push(`/users`)}
                      style={{
                        animationDelay: `${700 + index * 50}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                              <span className="text-base font-bold text-white">
                                {user.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {user.isActive && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 group-hover:text-purple-600 transition-colors">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-neutral-500">{user.phoneNumber}</p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 group-hover:scale-110 ${
                            user.isActive
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                              : 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div
              className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden transition-all duration-700 ${
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: '800ms' }}
            >
              <div className="px-6 py-5 border-b border-neutral-200/50 bg-gradient-to-r from-orange-50/50 to-pink-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                    <CogIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">Quick Actions</h2>
                    <p className="text-sm text-neutral-600 mt-0.5">Access management sections</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {statCards.map((stat, index) => (
                    <Link
                      key={stat.name}
                      href={stat.href}
                      className={`group relative flex flex-col items-center p-6 rounded-xl border-2 border-transparent bg-gradient-to-br ${stat.bgGradient} hover:border-white/50 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl ${stat.shadowColor} ${
                        mounted
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-90'
                      }`}
                      style={{
                        animationDelay: `${900 + index * 100}ms`,
                      }}
                    >
                      <div
                        className={`p-4 rounded-xl ${stat.iconBg} mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-bold text-neutral-700 group-hover:text-neutral-900 transition-colors text-center">
                        {stat.name}
                      </span>
                      {/* Hover shine effect */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </AdminLayout>
    </ProtectedRoute>
  )
}
