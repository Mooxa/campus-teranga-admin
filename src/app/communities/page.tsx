'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { communityAPI, Community } from '@/lib/api'
import { UsersIcon, PlusIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function CommunitiesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showCreateModal, setShowCreateModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showJoinModal, setShowJoinModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommunities()
    }
  }, [isAuthenticated])

  const fetchCommunities = async () => {
    try {
      const data = await communityAPI.getCommunities()
      setCommunities(Array.isArray(data) ? data : [])
    } catch {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-900">Chargement...</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">Communautés</h1>
              <p className="text-lg text-neutral-600">
                Rejoignez des communautés et échangez avec d&apos;autres étudiants
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Créer une communauté</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher des communautés..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <UsersIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Toutes les catégories</option>
              <option value="academic">Académique</option>
              <option value="social">Sociale</option>
              <option value="professional">Professionnelle</option>
              <option value="cultural">Culturelle</option>
              <option value="sports">Sportive</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => {
            const isMember = community.members.some((m) => m.user._id === user?._id)
            return (
              <div
                key={community._id}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {community.image && (
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                        {community.name}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                        {community.category}
                      </span>
                    </div>
                    {isMember && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                  </div>

                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {community.description}
                  </p>

                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>{community.members.length} membre(s)</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCommunity(community)
                      setShowJoinModal(true)
                    }}
                    className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      isMember
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {isMember ? 'Déjà membre' : 'Rejoindre'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Aucune communauté trouvée
            </h3>
            <p className="text-neutral-600">
              {searchQuery ? "Essayez avec d&apos;autres mots-clés" : 'Créez votre première communauté'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
