'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, Formation, Program } from '@/lib/api';
import AdminLayout from '@/components/Layout/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  BookOpenIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function FormationsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [showProgramsModal, setShowProgramsModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<{ program: Program; index: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'public' | 'private'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'created'>('name');

  useEffect(() => {
    if (isAuthenticated) {
      fetchFormations();
    }
  }, [isAuthenticated]);

  // Filter and sort formations
  useEffect(() => {
    const filtered = formations.filter(formation => {
      const matchesSearch = formation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           formation.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           formation.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || formation.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && formation.isActive) ||
                           (statusFilter === 'inactive' && !formation.isActive);
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort formations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const aName = a.name || '';
          const bName = b.name || '';
          return aName.localeCompare(bName);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredFormations(filtered);
  }, [formations, searchQuery, typeFilter, statusFilter, sortBy]);

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

  const handleViewPrograms = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowProgramsModal(true);
  };

  const handleAddProgram = () => {
    setEditingProgram({ program: { name: '', level: '', duration: '', language: '' }, index: -1 });
  };

  const handleSaveProgram = async () => {
    if (!selectedFormation || !editingProgram) return;

    try {
      if (editingProgram.index === -1) {
        await adminAPI.addProgram(selectedFormation._id, editingProgram.program);
      } else {
        await adminAPI.updateProgram(selectedFormation._id, editingProgram.program._id!, editingProgram.program);
      }
      await fetchFormations();
      setEditingProgram(null);
    } catch (error) {
      console.error('Failed to save program:', error);
    }
  };

  const handleDeleteProgram = async (program: Program) => {
    if (!program._id || !selectedFormation) return;
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      await adminAPI.deleteProgram(selectedFormation._id, program._id);
      await fetchFormations();
    } catch (error) {
      console.error('Failed to delete program:', error);
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
                    <p className="text-neutral-600 mt-1">Manage educational institutions and programs</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingFormation({} as Formation)}
                  className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Formation
                </button>
              </div>
            </div>
          </div>

          {/* Stats and Filters */}
          <div className="px-6 py-6">
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
                    <p className="text-sm font-medium text-neutral-600">Active</p>
                    <p className="text-2xl font-bold text-neutral-900">{formations.filter(f => f.isActive).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Public</p>
                    <p className="text-2xl font-bold text-neutral-900">{formations.filter(f => f.type === 'public').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AcademicCapIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Programs</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {formations.reduce((total, f) => total + (f.programs?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, short name, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | 'public' | 'private')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Types</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'type' | 'created')}
                    className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="type">Sort by Type</option>
                    <option value="created">Sort by Created</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formations List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFormations.map((formation) => (
                <div key={formation._id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                        {formation.name}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1">{formation.shortName}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          formation.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {formation.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          formation.type === 'public' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {formation.type}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                      {formation.description}
                    </p>

                    {/* Location */}
                    {formation.location && (
                      <div className="space-y-2 mb-4 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2 text-orange-500" />
                          <span>{formation.location.city}, {formation.location.district}</span>
                        </div>
                      </div>
                    )}

                    {/* Programs Count */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center text-sm text-neutral-500">
                        <AcademicCapIcon className="h-4 w-4 mr-2 text-orange-500" />
                        <span>{formation.programs?.length || 0} program(s)</span>
                      </div>
                      <button
                        onClick={() => handleViewPrograms(formation)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        View Programs →
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="text-xs text-neutral-400">
                        Created {new Date(formation.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleActive(formation)}
                          className="p-2 text-neutral-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-all"
                          title={formation.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {formation.isActive ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setEditingFormation(formation)}
                          className="p-2 text-neutral-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFormation(formation._id)}
                          className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
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

            {filteredFormations.length === 0 && (
              <div className="text-center py-16">
                <AcademicCapIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchQuery ? 'No formations found' : 'No formations yet'}
                </h3>
                <p className="text-neutral-600">Create your first formation to get started.</p>
              </div>
            )}
          </div>

          {/* Programs Modal */}
          {showProgramsModal && selectedFormation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">{selectedFormation.name}</h2>
                    <p className="text-sm text-neutral-500">{selectedFormation.shortName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProgramsModal(false);
                      setSelectedFormation(null);
                      setEditingProgram(null);
                    }}
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-all"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  {editingProgram ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-900">{
                        editingProgram.index === -1 ? 'Add New Program' : 'Edit Program'
                      }</h3>
                      <input
                        type="text"
                        placeholder="Program Name"
                        value={editingProgram.program.name}
                        onChange={(e) => setEditingProgram({ ...editingProgram, program: { ...editingProgram.program, name: e.target.value } })}
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Level (e.g., Bachelor, Master, PhD)"
                        value={editingProgram.program.level}
                        onChange={(e) => setEditingProgram({ ...editingProgram, program: { ...editingProgram.program, level: e.target.value } })}
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 4 years)"
                        value={editingProgram.program.duration}
                        onChange={(e) => setEditingProgram({ ...editingProgram, program: { ...editingProgram.program, duration: e.target.value } })}
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Language (e.g., French, English)"
                        value={editingProgram.program.language}
                        onChange={(e) => setEditingProgram({ ...editingProgram, program: { ...editingProgram.program, language: e.target.value } })}
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProgram}
                          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingProgram(null)}
                          className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">Programs ({selectedFormation.programs?.length || 0})</h3>
                        <button
                          onClick={handleAddProgram}
                          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Program
                        </button>
                      </div>

                      <div className="space-y-3">
                        {selectedFormation.programs?.map((program, index) => (
                          <div key={index} className="border border-neutral-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-neutral-900">{program.name}</h4>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingProgram({ program, index })}
                                  className="p-1 text-neutral-400 hover:text-blue-600"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProgram(program)}
                                  className="p-1 text-neutral-400 hover:text-red-600"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-neutral-600">
                              <p><span className="font-medium">Level:</span> {program.level}</p>
                              <p><span className="font-medium">Duration:</span> {program.duration}</p>
                              <p><span className="font-medium">Language:</span> {program.language}</p>
                            </div>
                          </div>
                        ))}

                        {(!selectedFormation.programs || selectedFormation.programs.length === 0) && (
                          <div className="text-center py-8 text-neutral-500">
                            No programs yet. Add one to get started.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

