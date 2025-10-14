'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, DashboardStats } from '@/lib/api';
import AdminLayout from '@/components/Layout/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  UsersIcon, 
  CalendarIcon, 
  AcademicCapIcon, 
  CogIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, isLoading, user });
    
    if (isAuthenticated) {
      fetchStats();
    } else if (!isLoading) {
      // If not authenticated and not loading, set loading to false
      setLoading(false);
    }
  }, [isAuthenticated, isLoading]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, setting loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      const data = await adminAPI.getStats();
      console.log('Stats fetched successfully:', data);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default stats to prevent infinite loading
      setStats({
        totalUsers: 0,
        totalEvents: 0,
        totalFormations: 0,
        totalServices: 0,
        activeUsers: 0,
        recentUsers: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-300 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-900">Loading Dashboard</h3>
            <p className="text-sm text-neutral-500">Preparing your data...</p>
          </div>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <UsersIcon className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-900">Authentication Required</h3>
            <p className="text-sm text-neutral-500">Please log in to access the dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'accent-blue',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      textColor: 'text-blue-600',
      change: '+12.5%',
      changeType: 'positive',
      trend: [65, 72, 78, 85, 92, 98, 105],
    },
    {
      name: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserGroupIcon,
      color: 'accent-green',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      textColor: 'text-green-600',
      change: '+8.2%',
      changeType: 'positive',
      trend: [45, 52, 48, 61, 67, 73, 78],
    },
    {
      name: 'Events',
      value: stats?.totalEvents || 0,
      icon: CalendarIcon,
      color: 'orange-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
      textColor: 'text-orange-600',
      change: '+15.3%',
      changeType: 'positive',
      trend: [12, 15, 18, 22, 19, 25, 28],
    },
    {
      name: 'Formations',
      value: stats?.totalFormations || 0,
      icon: AcademicCapIcon,
      color: 'accent-purple',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
      textColor: 'text-purple-600',
      change: '+5.7%',
      changeType: 'positive',
      trend: [8, 10, 12, 14, 16, 18, 20],
    },
    {
      name: 'Services',
      value: stats?.totalServices || 0,
      icon: CogIcon,
      color: 'accent-pink',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      textColor: 'text-pink-600',
      change: '+3.1%',
      changeType: 'positive',
      trend: [5, 6, 7, 8, 9, 10, 11],
    },
  ];

  const quickStats = [
    { label: 'Page Views', value: '2,847', icon: EyeIcon, color: 'text-blue-600' },
    { label: 'Mobile Users', value: '1,234', icon: DevicePhoneMobileIcon, color: 'text-green-600' },
    { label: 'Desktop Users', value: '1,613', icon: ComputerDesktopIcon, color: 'text-purple-600' },
    { label: 'Global Reach', value: '24', icon: GlobeAltIcon, color: 'text-orange-600' },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
          {/* Debug Panel - Remove this in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 m-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
                <div>isLoading (auth): {isLoading ? 'true' : 'false'}</div>
                <div>loading (dashboard): {loading ? 'true' : 'false'}</div>
                <div>user: {user ? user.fullName : 'null'}</div>
                <div>stats: {stats ? 'loaded' : 'null'}</div>
              </div>
            </div>
          )}
          
          <div className="space-y-6 md:space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
                <p className="text-orange-100 text-base md:text-lg mb-4 md:mb-6">Here&apos;s what&apos;s happening with your platform today.</p>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 md:gap-4">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 md:px-4">
                      <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color.replace('text-', 'text-')}`} />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
                        <span className="text-xs md:text-sm font-medium">{stat.value}</span>
                        <span className="text-xs text-orange-200 hidden sm:inline">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-5 -left-5 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full"></div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
              {statCards.map((stat, index) => (
                <div 
                  key={stat.name} 
                  className="group bg-white border border-neutral-200/60 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500 animate-slide-up hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-medium text-neutral-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-neutral-900">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>

                  {/* Mini Trend Chart */}
                  <div className="mt-4 flex items-end space-x-1 h-8">
                    {stat.trend.map((value, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${stat.textColor.replace('text-', 'bg-').replace('-600', '-200')} group-hover:${stat.textColor.replace('text-', 'bg-').replace('-600', '-300')} transition-all duration-300`}
                        style={{ 
                          height: `${(value / Math.max(...stat.trend)) * 100}%`,
                          animationDelay: `${(index * 100) + (i * 50)}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Recent Users */}
              {stats?.recentUsers && stats.recentUsers.length > 0 && (
                <div className="bg-white border border-neutral-200/60 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="px-4 md:px-6 py-4 md:py-5 border-b border-neutral-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-neutral-900">Recent Users</h3>
                        <p className="text-xs md:text-sm text-neutral-500 mt-1">Latest registered users</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <UsersIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {stats.recentUsers.slice(0, 5).map((user, index) => (
                      <div 
                        key={user._id} 
                        className="px-4 md:px-6 py-3 md:py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 animate-slide-up group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                              <span className="text-xs md:text-sm font-bold text-white">
                                {user.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-semibold text-neutral-900 truncate group-hover:text-blue-700 transition-colors">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              {user.phoneNumber}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isActive 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 md:px-6 py-3 md:py-4 bg-neutral-50 border-t border-neutral-100">
                    <button className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      View all users →
                    </button>
                  </div>
                </div>
              )}

              {/* Activity Overview */}
              <div className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">Activity Overview</h3>
                      <p className="text-sm text-neutral-500 mt-1">Platform activity insights</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-xl">
                      <ChartBarIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600">User Engagement</span>
                      <span className="text-sm font-bold text-green-600">+24%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600">Event Participation</span>
                      <span className="text-sm font-bold text-blue-600">+18%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600">Formation Completion</span>
                      <span className="text-sm font-bold text-purple-600">+12%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
                    <p className="text-sm text-neutral-500 mt-1">Manage your platform efficiently</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <CogIcon className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <button className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 p-6 rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <UsersIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">
                          Manage Users
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          View and manage accounts
                        </p>
                      </div>
                    </div>
                  </button>

                  <button className="group relative bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-6 rounded-2xl border border-green-200/50 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-200/50 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <CalendarIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-green-700 transition-colors">
                          Manage Events
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Create and manage events
                        </p>
                      </div>
                    </div>
                  </button>

                  <button className="group relative bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 p-6 rounded-2xl border border-purple-200/50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/50 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <AcademicCapIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-purple-700 transition-colors">
                          Manage Formations
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Create and manage formations
                        </p>
                      </div>
                    </div>
                  </button>

                  <button className="group relative bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 p-6 rounded-2xl border border-pink-200/50 hover:border-pink-300 transition-all duration-300 hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <CogIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-pink-700 transition-colors">
                          Manage Services
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Create and manage services
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Performance Metrics</h3>
                    <p className="text-sm text-neutral-500 mt-1">Real-time platform performance</p>
                  </div>
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                    <div className="text-sm text-neutral-600">Uptime</div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1.2s</div>
                    <div className="text-sm text-neutral-600">Response Time</div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
                    <div className="text-sm text-neutral-600">User Rating</div>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
