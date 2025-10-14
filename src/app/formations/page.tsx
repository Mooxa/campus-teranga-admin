'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, Formation } from '@/lib/api';
import AdminLayout from '@/components/Layout/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  SparklesIcon,
  BookOpenIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function FormationsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'level' | 'created'>('title');

  useEffect(() => {
    if (isAuthenticated) {
      fetchFormations();
    }
  }, [isAuthenticated]);

  // Filter and sort formations
  useEffect(() => {
    const filtered = formations.filter(formation => {
      const matchesSearch = (formation.title && formation.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (formation.description && formation.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLevel = levelFilter === 'all' || (formation.level && formation.level.toLowerCase() === levelFilter);
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && formation.isActive) ||
                           (statusFilter === 'inactive' && !formation.isActive);
      
      return matchesSearch && matchesLevel && matchesStatus;
    });

    // Sort formations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          const aTitle = a.title || '';
          const bTitle = b.title || '';
          return aTitle.localeCompare(bTitle);
        case 'level':
          const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          const aLevel = a.level ? a.level.toLowerCase() : 'beginner';
          const bLevel = b.level ? b.level.toLowerCase() : 'beginner';
          return levelOrder[aLevel as keyof typeof levelOrder] - levelOrder[bLevel as keyof typeof levelOrder];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredFormations(filtered);
  }, [formations, searchQuery, levelFilter, statusFilter, sortBy]);

  const fetchFormations = async () => {
    try {
      const data = await adminAPI.getFormations();
      setFormations(data);
    } catch (error) {
      console.error('Failed to fetch formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (formation: Formation) => {
    try {
      await adminAPI.updateFormation(formation._id, { isActive: !formation.isActive });
      setFormations(formations.map(f => f._id === formation._id ? { ...f, isActive: !f.isActive } : f));
    } catch (error) {
      console.error('Failed to update formation:', error);
    }
  };

  const handleDeleteFormation = async (formationId: string) => {
    if (confirm('Are you sure you want to delete this formation?')) {
      try {
        await adminAPI.deleteFormation(formationId);
        setFormations(formations.filter(f => f._id !== formationId));
      } catch (error) {
        console.error('Failed to delete formation:', error);
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
                <h3 className="text-lg font-semibold text-neutral-900">Loading Formations</h3>
                <p className="text-sm text-neutral-500">Preparing your formations data...</p>
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
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Formations Management</h1>
                    <p className="text-neutral-600 mt-1">Manage educational courses and training programs</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Formation
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
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Formations</p>
                    <p className="text-2xl font-bold text-neutral-900">{formations.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <EyeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Active Formations</p>
                    <p className="text-2xl font-bold text-neutral-900">{formations.filter(f => f.isActive).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <StarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Advanced Level</p>
                    <p className="text-2xl font-bold text-neutral-900">{formations.filter(f => f.level && f.level.toLowerCase() === 'advanced').length}</p>
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
                      {formations.filter(f => new Date(f.createdAt).getMonth() === new Date().getMonth()).length}
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
                    placeholder="Search formations by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
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
                    onChange={(e) => setSortBy(e.target.value as 'title' | 'level' | 'created')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="title">Sort by Title</option>
                    <option value="level">Sort by Level</option>
                    <option value="created">Sort by Created</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFormations.map((formation) => (
                <div key={formation._id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                          {formation.title || 'Untitled Formation'}
                        </h3>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            formation.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {formation.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            !formation.level || formation.level.toLowerCase() === 'beginner' 
                              ? 'bg-blue-100 text-blue-800'
                              : formation.level.toLowerCase() === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {formation.level || 'Beginner'}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors duration-200">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                      {formation.description || 'No description available'}
                    </p>

                    {/* Formation Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-neutral-500">
                        <ClockIcon className="h-4 w-4 mr-3 text-orange-500" />
                        <span className="font-medium">{formation.duration || 'Duration not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500">
                        <AcademicCapIcon className="h-4 w-4 mr-3 text-orange-500" />
                        <span>Level: {formation.level || 'Beginner'}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="text-xs text-neutral-400">
                        Created {new Date(formation.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleActive(formation)}
                          className="p-2 text-neutral-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200"
                          title={formation.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {formation.isActive ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingFormation(formation)}
                          className="p-2 text-neutral-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFormation(formation._id)}
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
            {filteredFormations.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
                  <AcademicCapIcon className="h-12 w-12 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchQuery || levelFilter !== 'all' || statusFilter !== 'all' ? 'No formations found' : 'No formations yet'}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {searchQuery || levelFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by creating your first formation.'}
                </p>
                {(!searchQuery && levelFilter === 'all' && statusFilter === 'all') && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Your First Formation
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
