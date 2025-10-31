'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, User } from '@/lib/api';
import AdminLayout from '@/components/Layout/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function UsersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [_showCreateModal, setShowCreateModal] = useState(false);
  const [_editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super_admin' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'created'>('name');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Filter and sort users
  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (user.university && user.university.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (user.country && user.country.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && user.isActive) ||
                           (statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const aName = a.fullName || '';
          const bName = b.fullName || '';
          return aName.localeCompare(bName);
        case 'role':
          const roleOrder = { super_admin: 0, admin: 1, user: 2 };
          return roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await adminAPI.updateUser(user._id, { isActive: !user.isActive });
      setUsers(users.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (isLoading || loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-300 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-neutral-900">Loading Users</h3>
                <p className="text-sm text-neutral-500">Preparing your users data...</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
          {/* Header Section */}
          <div className="bg-white border-b border-neutral-200">
            <div className="px-6 py-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Users Management</h1>
                    <p className="text-neutral-600 mt-1">Manage user accounts, roles, and permissions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Stats and Filters Section */}
          <div className="px-6 py-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Users</p>
                    <p className="text-2xl font-bold text-neutral-900">{users.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <EyeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Active Users</p>
                    <p className="text-2xl font-bold text-neutral-900">{users.filter(u => u.isActive).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Admins</p>
                    <p className="text-2xl font-bold text-neutral-900">{users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <SparklesIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">This Month</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, phone, email, university..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'super_admin' | 'admin' | 'user')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Roles</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'role' | 'created')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="role">Sort by Role</option>
                    <option value="created">Sort by Created</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-lg">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                            user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors duration-200">
                            {user.fullName}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'super_admin' 
                                ? 'bg-red-100 text-red-800'
                                : user.role === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors duration-200">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-neutral-500">
                        <PhoneIcon className="h-4 w-4 mr-3 text-orange-500" />
                        <span>{user.phoneNumber}</span>
                      </div>
                      {user.email && (
                        <div className="flex items-center text-sm text-neutral-500">
                          <EnvelopeIcon className="h-4 w-4 mr-3 text-orange-500" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-neutral-500">
                        <MapPinIcon className="h-4 w-4 mr-3 text-orange-500" />
                        <span>{user.country}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500">
                        <AcademicCapIcon className="h-4 w-4 mr-3 text-orange-500" />
                        <span className="truncate">{user.university}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="text-xs text-neutral-400">
                        Joined {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleActive(user)}
                          className="p-2 text-neutral-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200"
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-neutral-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
                  <UserGroupIcon className="h-12 w-12 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' ? 'No users found' : 'No users yet'}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by adding your first user.'}
                </p>
                {(!searchQuery && roleFilter === 'all' && statusFilter === 'all') && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Your First User
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
