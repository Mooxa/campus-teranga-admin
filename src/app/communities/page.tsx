'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { adminAPI, Community } from '@/lib/api'
import AdminLayout from '@/components/Layout/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function CommunitiesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [communities, setCommunities] = useState<Community[]>([])
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'created'>('name')

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommunities()
    }
  }, [isAuthenticated])

  // Filter and sort communities
  useEffect(() => {
    const filtered = communities.filter((community) => {
      const matchesSearch =
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || community.category === categoryFilter

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && community.isActive) ||
        (statusFilter === 'inactive' && !community.isActive)

      return matchesSearch && matchesCategory && matchesStatus
    })

    // Sort communities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    setFilteredCommunities(filtered)
  }, [communities, searchQuery, categoryFilter, statusFilter, sortBy])

  const fetchCommunities = async () => {
    try {
      const data = await adminAPI.getCommunities()
      setCommunities(Array.isArray(data) ? data : [])
    } catch {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (community: Community) => {
    try {
      await adminAPI.updateCommunity(community._id, { isActive: !community.isActive })
      setCommunities(
        communities.map((c) => (c._id === community._id ? { ...c, isActive: !c.isActive } : c))
      )
    } catch {
      // Error handled silently
    }
  }

  const handleTogglePublic = async (community: Community) => {
    try {
      await adminAPI.updateCommunity(community._id, { isPublic: !community.isPublic })
      setCommunities(
        communities.map((c) => (c._id === community._id ? { ...c, isPublic: !c.isPublic } : c))
      )
    } catch {
      // Error handled silently
    }
  }

  const handleDeleteCommunity = async (communityId: string) => {
    if (confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      try {
        await adminAPI.deleteCommunity(communityId)
        setCommunities(communities.filter((c) => c._id !== communityId))
      } catch {
        // Error handled silently
      }
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      academic: 'Académique',
      social: 'Sociale',
      professional: 'Professionnelle',
      cultural: 'Culturelle',
      sports: 'Sportive',
      other: 'Autre',
    }
    return labels[category] || category
  }

  const handleSaveCommunity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const communityData: Partial<Community> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as Community['category'],
      image: formData.get('image') as string || '',
      isPublic: formData.get('isPublic') === 'true',
      isActive: formData.get('isActive') === 'true',
    }

    try {
      if (editingCommunity?._id) {
        await adminAPI.updateCommunity(editingCommunity._id, communityData)
      } else {
        await adminAPI.createCommunity(communityData)
      }
      await fetchCommunities()
      setShowCreateModal(false)
      setEditingCommunity(null)
    } catch {
      // Error handled silently
    }
  }

  const handleCancelCommunity = () => {
    setShowCreateModal(false)
    setEditingCommunity(null)
  }

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
                <h3 className="text-lg font-semibold text-neutral-900">Loading Communities</h3>
                <p className="text-sm text-neutral-500">Preparing your communities data...</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
          {/* Header Section */}
          <div className="bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                    <BuildingOfficeIcon className="h-8 w-8 text-orange-500" />
                    Communities Management
                  </h1>
                  <p className="mt-2 text-sm text-neutral-600">
                    Manage and monitor all communities on the platform
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCommunity(null)
                    setShowCreateModal(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create Community
                </button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="academic">Academic</option>
                  <option value="social">Social</option>
                  <option value="professional">Professional</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'created')}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                  <option value="created">Sort by Created Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Communities List */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {filteredCommunities.length === 0 ? (
              <div className="text-center py-16">
                <BuildingOfficeIcon className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'No communities found'
                    : 'No communities yet'}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first community'}
                </p>
                {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                  <button
                    onClick={() => {
                      setEditingCommunity(null)
                      setShowCreateModal(true)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create Community
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community) => (
                  <div
                    key={community._id}
                    className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Community Image */}
                    {community.image && (
                      <div className="h-48 bg-gradient-to-br from-indigo-100 to-blue-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={community.image}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Community Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                            {community.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <TagIcon className="h-4 w-4 text-neutral-400" />
                            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold">
                              {getCategoryLabel(community.category)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {community.isActive ? (
                            <EyeIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <EyeSlashIcon className="h-5 w-5 text-neutral-400" />
                          )}
                        </div>
                      </div>

                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {community.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-neutral-500 mb-4 pb-4 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{community.members?.length || 0} members</span>
                        </div>
                        <div>
                          <span>{community.posts?.length || 0} posts</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(community)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            community.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {community.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => handleTogglePublic(community)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            community.isPublic
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {community.isPublic ? 'Public' : 'Private'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommunity(community)
                            setShowCreateModal(true)
                          }}
                          className="px-3 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCommunity(community._id)}
                          className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Count */}
            {filteredCommunities.length > 0 && (
              <div className="mt-8 text-center text-sm text-neutral-600">
                Showing {filteredCommunities.length} of {communities.length} communities
              </div>
            )}
          </div>

          {/* Community Add/Edit Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {editingCommunity?._id ? 'Edit Community' : 'Create New Community'}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      {editingCommunity?._id
                        ? 'Update community information'
                        : 'Create a new community for students to join'}
                    </p>
                  </div>
                  <button
                    onClick={handleCancelCommunity}
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-all"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSaveCommunity} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingCommunity?.name || ''}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Club Informatique"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        defaultValue={editingCommunity?.category || 'academic'}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="academic">Academic</option>
                        <option value="social">Social</option>
                        <option value="professional">Professional</option>
                        <option value="cultural">Cultural</option>
                        <option value="sports">Sports</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Public Status */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Visibility <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="isPublic"
                        defaultValue={
                          editingCommunity?.isPublic !== undefined
                            ? editingCommunity.isPublic.toString()
                            : 'true'
                        }
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                      </select>
                    </div>

                    {/* Active Status */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="isActive"
                        defaultValue={
                          editingCommunity?.isActive !== undefined
                            ? editingCommunity.isActive.toString()
                            : 'true'
                        }
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingCommunity?.description || ''}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter a detailed description of the community..."
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      defaultValue={editingCommunity?.image || ''}
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-3 pt-4 border-t border-neutral-200">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {editingCommunity?._id ? 'Update Community' : 'Create Community'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCommunity}
                      className="flex-1 px-6 py-3 bg-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
