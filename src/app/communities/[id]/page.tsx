'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  UserGroupIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { communityAPI, Community, CommunityMember, CommunityPost } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

const formatDate = (date?: string) => {
  if (!date) {
    return ''
  }
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  } catch {
    return date
  }
}

const getInitials = (name?: string) => {
  if (!name) {
    return '?'
  }
  const segments = name.trim().split(/\s+/)
  if (segments.length === 1) {
    return segments[0].slice(0, 2).toUpperCase()
  }
  return (segments[0][0] + segments[segments.length - 1][0]).toUpperCase()
}

type StatusMessage = {
  type: 'success' | 'error'
  message: string
}

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const communityParam = params?.id
  const communityId = Array.isArray(communityParam) ? communityParam[0] : communityParam

  const { user, isLoading: authLoading } = useAuth()

  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const fetchCommunity = useCallback(
    async (withSpinner = true) => {
      if (!communityId) {
        setError('Communauté introuvable.')
        setCommunity(null)
        setLoading(false)
        return
      }

      if (withSpinner) {
        setLoading(true)
      }
      setError('')

      try {
        const data = await communityAPI.getCommunity(communityId)

        if (!data?.isApproved) {
          setCommunity(null)
          setError("Cette communauté n'est pas disponible pour le moment.")
        } else {
          setCommunity(data)
        }
      } catch (err: unknown) {
        setCommunity(null)
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de récupérer les informations de la communauté.'
        )
      } finally {
        if (withSpinner) {
          setLoading(false)
        }
      }
    },
    [communityId]
  )

  useEffect(() => {
    fetchCommunity(true)
  }, [fetchCommunity])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const isMember = useMemo(() => {
    if (!community || !user) {
      return false
    }

    return community.members?.some((member: CommunityMember) => {
      const memberUser = member.user as unknown as { _id?: string; id?: string }
      const memberId = memberUser?._id || memberUser?.id
      return memberId === user._id
    })
  }, [community, user])

  const handleJoinCommunity = async () => {
    if (!communityId) {
      return
    }

    if (!user) {
      router.push('/login')
      return
    }

    setJoining(true)
    setStatusMessage(null)

    try {
      await communityAPI.joinCommunity(communityId)
      setStatusMessage({
        type: 'success',
        message: 'Vous avez rejoint la communauté avec succès !',
      })
      await fetchCommunity(false)
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Impossible de rejoindre la communauté pour le moment.',
      })
    } finally {
      setJoining(false)
    }
  }

  const displayedMembers = useMemo(
    () => (community?.members?.slice(0, 6) as CommunityMember[]) ?? [],
    [community]
  )
  const remainingMembersCount = Math.max(
    (community?.members?.length ?? 0) - displayedMembers.length,
    0
  )
  const communityPosts: CommunityPost[] = (community?.posts as CommunityPost[]) ?? []

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-200">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-300 animate-pulse"></div>
          </div>
          <p className="text-sm text-neutral-600">Chargement de la communauté...</p>
        </div>
      </div>
    )
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl border border-neutral-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-semibold">
            CT
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Communauté indisponible</h1>
          <p className="text-neutral-600">
            {error ||
              "Nous n'avons pas pu trouver cette communauté ou elle n'est pas encore disponible."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fetchCommunity(true)}
              className="px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors duration-200"
            >
              Réessayer
            </button>
            <button
              onClick={() => router.push('/home')}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors duration-200"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  const categoryLabels: Record<Community['category'], string> = {
    academic: 'Académique',
    social: 'Sociale',
    professional: 'Professionnelle',
    cultural: 'Culturelle',
    sports: 'Sportive',
    other: 'Autre',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-purple-600 transition-colors duration-200 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Retour</span>
          </button>
        </div>

        <div className="mt-6 bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="relative h-64 md:h-full">
              {community.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={community.image}
                  alt={community.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-purple-500 via-purple-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials(community.name)}
                </div>
              )}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 text-purple-600 text-xs font-semibold uppercase">
                {categoryLabels[community.category]}
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
                Créée le {formatDate(community.createdAt)}
              </div>
            </div>

            <div className="md:col-span-2 p-8 space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
                  {community.name}
                </h1>
                <p className="text-neutral-600 leading-relaxed">{community.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-purple-50 border border-purple-100">
                  <UserGroupIcon className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Membres</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {community.members?.length ?? 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-blue-50 border border-blue-100">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Discussions</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {community.posts?.length ?? 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <ClockIcon className="h-6 w-6 text-emerald-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Activité récente</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {formatDate(community.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-500">
                    Animé par{' '}
                    <span className="font-medium text-neutral-900">
                      {community.creator?.fullName || 'un membre de Campus Teranga'}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">Statut : Communauté approuvée</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleJoinCommunity}
                    disabled={joining || isMember}
                    className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-sm ${
                      isMember
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : 'bg-purple-500 text-white hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isMember ? 'Vous êtes membre' : joining ? 'Rejoindre en cours...' : 'Rejoindre la communauté'}
                  </button>
                  <button
                    onClick={() => router.push('/home')}
                    className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors duration-200"
                  >
                    Explorer d&apos;autres communautés
                  </button>
                </div>
              </div>

              {statusMessage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}
                >
                  {statusMessage.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">À propos</h2>
              <p className="text-neutral-600 leading-relaxed">
                  {community.description ||
                    "Cette communauté rassemble les étudiants et professionnels partageant des intérêts communs au sein de Campus Teranga."}
              </p>
            </section>

            <section className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Discussions récentes</h2>
                <span className="text-sm text-neutral-500">
                  {communityPosts.length} discussion{communityPosts.length > 1 ? 's' : ''}
                </span>
              </div>

              {communityPosts.length === 0 ? (
                <div className="border border-dashed border-neutral-200 rounded-2xl p-8 text-center space-y-2">
                  <ChatBubbleLeftRightIcon className="h-10 w-10 text-neutral-300 mx-auto" />
                  <p className="text-sm text-neutral-500">
                    Aucune discussion pour le moment. Rejoignez la communauté pour lancer un sujet !
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {communityPosts.slice(0, 5).map((post: CommunityPost) => (
                    <div
                      key={post._id}
                      className="border border-neutral-200 rounded-2xl p-6 hover:border-purple-200 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                            {getInitials(post.author?.fullName || '')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {post.author?.fullName || 'Membre'}
                            </p>
                            <p className="text-xs text-neutral-500">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-600">
                          {post.comments?.length ?? 0} commentaire
                          {(post.comments?.length ?? 0) > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{post.content}</p>
                    </div>
                  ))}
                  {communityPosts.length > 5 && (
                    <div className="text-center">
                      <p className="text-sm text-neutral-500">
                        D&apos;autres discussions sont disponibles après avoir rejoint la communauté.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-8">
            <section className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Membres</h2>
                <UsersIcon className="h-6 w-6 text-purple-500" />
              </div>

              {displayedMembers.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Aucun membre visible pour le moment. Soyez le premier à rejoindre cette communauté !
                </p>
              ) : (
                <div className="space-y-4">
                  {displayedMembers.map((member) => {
                    const memberUser = member.user as unknown as { _id?: string; fullName?: string }
                    const memberName = memberUser?.fullName || 'Membre'
                    const memberId = memberUser?._id || member.joinedAt
                    return (
                      <div
                        key={
                          memberId
                        }
                        className="flex items-center space-x-3"
                      >
                        <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm">
                          {getInitials(memberName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{memberName}</p>
                          <p className="text-xs text-neutral-500 capitalize">
                            Rôle : {member.role === 'owner' ? 'Fondateur' : member.role}
                          </p>
                          <p className="text-xs text-neutral-400">
                            Membre depuis {formatDate(member.joinedAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  {remainingMembersCount > 0 && (
                    <p className="text-xs text-neutral-500">
                      +{remainingMembersCount} autre{remainingMembersCount > 1 ? 's' : ''} membre
                      {remainingMembersCount > 1 ? 's' : ''} attendent votre arrivée.
                    </p>
                  )}
                </div>
              )}
            </section>

            <section className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8 space-y-4">
              <h2 className="text-xl font-semibold text-neutral-900">Informations pratiques</h2>
              <div className="space-y-3 text-sm text-neutral-600">
                <p>
                  <span className="font-semibold text-neutral-800">Type :</span>{' '}
                  {community.isPublic ? 'Communauté ouverte' : 'Communauté privée'}
                </p>
                <p>
                  <span className="font-semibold text-neutral-800">Statut :</span>{' '}
                  {community.isActive ? 'Active' : 'Inactive'}
                </p>
                <p>
                  <span className="font-semibold text-neutral-800">Créateur :</span>{' '}
                  {community.creator?.fullName || 'Non renseigné'}
                </p>
                <p>
                  <span className="font-semibold text-neutral-800">Mise à jour :</span>{' '}
                  {formatDate(community.updatedAt)}
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

