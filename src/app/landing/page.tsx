'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { publicAPI, communityAPI } from '@/lib/api'
import {
  AcademicCapIcon,
  CalendarIcon,
  CogIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  RocketLaunchIcon,
  HeartIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [realStats, setRealStats] = useState({
    formations: 0,
    events: 0,
    services: 0,
    communities: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [formations, events, services, communities] = await Promise.all([
          publicAPI.getFormations().catch(() => []),
          publicAPI.getEvents().catch(() => []),
          publicAPI.getServices().catch(() => []),
          communityAPI.getCommunities().catch(() => []),
        ])

        setRealStats({
          formations: Array.isArray(formations) ? formations.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          communities: Array.isArray(communities) ? communities.length : 0,
        })
      } catch {
        // Handle error silently
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const [animatedStats, setAnimatedStats] = useState({
    formations: 0,
    events: 0,
    services: 0,
    communities: 0,
  })

  // Animate counters with real data
  useEffect(() => {
    if (isVisible && !loadingStats) {
      const animateCounter = (
        target: number,
        key: keyof typeof animatedStats,
        duration: number = 2000
      ) => {
        let start = 0
        const increment = target / (duration / 16)
        const timer = setInterval(() => {
          start += increment
          if (start >= target) {
            setAnimatedStats((prev) => ({ ...prev, [key]: target }))
            clearInterval(timer)
          } else {
            setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(start) }))
          }
        }, 16)
      }

      animateCounter(realStats.formations, 'formations', 1500)
      animateCounter(realStats.events, 'events', 1800)
      animateCounter(realStats.services, 'services', 1200)
      animateCounter(realStats.communities, 'communities', 1600)
    }
  }, [isVisible, loadingStats, realStats])

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Formations Éducatives',
      description:
        'Accédez à des formations de qualité adaptées à votre niveau et à vos objectifs professionnels.',
      color: 'text-orange-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      delay: '0ms',
    },
    {
      icon: CalendarIcon,
      title: 'Événements Étudiants',
      description:
        'Participez à des événements enrichissants et développez votre réseau professionnel.',
      color: 'text-blue-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      delay: '200ms',
    },
    {
      icon: CogIcon,
      title: 'Services Étudiants',
      description: 'Bénéficiez de services dédiés pour faciliter votre vie étudiante au Sénégal.',
      color: 'text-green-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      delay: '400ms',
    },
    {
      icon: UsersIcon,
      title: 'Communauté',
      description: "Rejoignez une communauté dynamique d'étudiants et de professionnels.",
      color: 'text-purple-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      delay: '600ms',
    },
  ]

  const stats = [
    {
      number: animatedStats.formations,
      label: 'Formations Disponibles',
      icon: AcademicCapIcon,
      color: 'text-orange-500',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
    {
      number: animatedStats.events,
      label: 'Événements Organisés',
      icon: CalendarIcon,
      color: 'text-blue-500',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      number: animatedStats.services,
      label: 'Services Étudiants',
      icon: CogIcon,
      color: 'text-green-500',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      number: animatedStats.communities,
      label: 'Communautés Actives',
      icon: BuildingOfficeIcon,
      color: 'text-purple-500',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
  ]


  const benefits = [
    'Accompagnement personnalisé pour votre intégration',
    'Réseau professionnel étendu',
    'Formations certifiantes reconnues',
    'Événements culturels et professionnels',
    'Support administratif complet',
    "Communauté d'entraide étudiante",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">CT</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                Campus Téranga
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                À Propos
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-50 border border-orange-200"
                  >
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.fullName}
                    </span>
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false)
                            router.push('/profile/edit')
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>Modifier le profil</span>
                        </button>

                        <button
                          onClick={() => {
                            if (user.role === 'admin' || user.role === 'super_admin') {
                              router.push('/dashboard')
                            } else {
                              router.push('/home')
                            }
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>Tableau de bord</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false)
                            logout()
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-400" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Show registration and login buttons for non-authenticated users */}
                  <Link
                    href="/register"
                    className="text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-50 border border-orange-200"
                  >
                    Inscription
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-50"
                  >
                    Connexion
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                className="block text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Services
              </a>
              <a
                href="#about"
                className="block text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                À Propos
              </a>
              <a
                href="#contact"
                className="block text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Contact
              </a>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (user.role === 'admin' || user.role === 'super_admin') {
                          router.push('/dashboard')
                        } else {
                          router.push('/home')
                        }
                      }}
                      className="block w-full text-center text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-orange-50 border border-orange-200"
                    >
                      Accéder au Dashboard
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="block w-full text-center text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-orange-50 border border-orange-200"
                    >
                      Inscription
                    </Link>
                    <Link
                      href="/login"
                      className="block w-full text-center text-gray-600 hover:text-orange-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-orange-50"
                    >
                      Connexion
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modern Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8 animate-fade-in-up">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Plateforme #1 pour les étudiants au Sénégal
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Votre Guide au{' '}
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent animate-pulse">
                Sénégal
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
              Découvrez Campus Téranga, la plateforme qui accompagne les étudiants dans leur
              parcours éducatif et professionnel au Sénégal.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="#features"
                className="group bg-white text-orange-600 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
              >
                Découvrir les Services
                <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white hover:text-orange-600 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105">
                <PlayIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Voir la Vidéo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Sécurisé & Fiable</span>
              </div>
              <div className="flex items-center">
                <HeartIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Communauté Bienveillante</span>
              </div>
              <div className="flex items-center">
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Croissance Garantie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section
        ref={statsRef}
        className="py-20 bg-gradient-to-r from-slate-50 to-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500 to-blue-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Des Chiffres qui{' '}
              <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                Parlent
              </span>
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Découvrez l&apos;impact de Campus Téranga sur la communauté étudiante sénégalaise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loadingStats ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gray-200 animate-pulse"></div>
                    <div className="h-12 w-20 mx-auto mb-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </>
            ) : (
              stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div
                  className={`text-4xl md:text-5xl font-bold ${stat.color} mb-3 group-hover:scale-105 transition-transform duration-300`}
                >
                  {stat.number}+
                </div>
                <div className="text-gray-800 font-semibold text-lg">{stat.label}</div>
              </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-br from-white via-slate-50 to-orange-50 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
              <LightBulbIcon className="w-4 h-4 mr-2" />
              Nos Services
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Tout ce dont vous avez{' '}
              <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                besoin
              </span>
            </h2>
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
              Une plateforme complète pour accompagner votre réussite académique et professionnelle
              au Sénégal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push('/login')
                    return
                  }

                  // Navigate based on feature type
                  switch (feature.title) {
                    case 'Formations Éducatives':
                      router.push('/home?tab=formations')
                      break
                    case 'Événements Étudiants':
                      router.push('/home?tab=events')
                      break
                    case 'Services Étudiants':
                      router.push('/home?tab=services')
                      break
                    case 'Communauté':
                      // Could navigate to a community page later
                      router.push('/home')
                      break
                    default:
                      router.push('/home')
                  }
                }}
                className="group relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer w-full text-left"
                style={{ animationDelay: feature.delay }}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 rounded-3xl ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                  >
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRightIcon className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services We Offer Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-orange-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm text-orange-300 text-sm font-semibold mb-8">
              <CogIcon className="w-4 h-4 mr-2" />
              Nos Services
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Services que nous{' '}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                offrons
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
              Nous croyons en la puissance de l&apos;éducation et de la communauté pour transformer
              des vies et construire un avenir meilleur pour le Sénégal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Accompagnement Personnalisé</h3>
              <p className="text-white/90 leading-relaxed">
                Accompagnement personnalisé pour votre intégration dans l&apos;écosystème éducatif
                sénégalais avec un suivi individuel.
              </p>
            </div>

            {/* Service 2 */}
            <div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Réseau Professionnel</h3>
              <p className="text-white/90 leading-relaxed">
                Réseau professionnel étendu pour connecter les étudiants avec des opportunités de
                carrière et des mentors.
              </p>
            </div>

            {/* Service 3 */}
            <div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Formations Certifiantes</h3>
              <p className="text-white/90 leading-relaxed">
                Formations certifiantes reconnues par l&apos;industrie pour développer vos
                compétences professionnelles.
              </p>
            </div>

            {/* Service 4 */}
            <div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Événements Culturels</h3>
              <p className="text-white/90 leading-relaxed">
                Événements culturels et professionnels pour enrichir votre expérience étudiante et
                développer votre réseau.
              </p>
            </div>

            {/* Service 5 */}
            <div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Support Administratif</h3>
              <p className="text-white/90 leading-relaxed">
                Support administratif complet pour faciliter vos démarches et votre intégration dans
                le système éducatif.
              </p>
            </div>

            {/* Service 6 */}
            <div className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <HeartIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Communauté d&apos;Entraide</h3>
              <p className="text-white/90 leading-relaxed">
                Communauté d&apos;entraide étudiante pour partager expériences, conseils et créer
                des liens durables.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
              <Link
                href="/login"
                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
              >
                Découvrir nos Services
                <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#contact"
                className="group border-2 border-white/50 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              >
                <ChatBubbleLeftRightIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Modern About Section */}
      <section
        id="about"
        className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 bg-orange-200/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
                  <HeartIcon className="w-4 h-4 mr-2" />À Propos de Nous
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Votre Partenaire de{' '}
                  <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                    Réussite
                  </span>
                </h2>
              </div>

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Campus Téranga est né de la volonté de faciliter l&apos;intégration et la réussite
                  des étudiants au Sénégal. Notre mission est de créer un écosystème éducatif
                  dynamique qui accompagne chaque étudiant dans son parcours.
                </p>
                <p>
                  Nous croyons en la puissance de l&apos;éducation et de la communauté pour
                  transformer des vies et construire un avenir meilleur pour le Sénégal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3 mt-1 group-hover:scale-110 transition-transform duration-200">
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-blue-600 rounded-3xl p-10 text-white shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full"></div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6">Notre Mission</h3>
                  <p className="text-white mb-8 text-lg leading-relaxed">
                    &quot;Accompagner chaque étudiant dans son parcours éducatif et professionnel au
                    Sénégal, en créant des opportunités de croissance et de réussite.&quot;
                  </p>

                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <AcademicCapIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="font-bold text-xl">Équipe Campus Téranga</div>
                      <div className="text-white">Dédiée à votre réussite</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm text-white text-sm font-semibold mb-8">
              <RocketLaunchIcon className="w-4 h-4 mr-2" />
              Rejoignez-nous dès maintenant
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Prêt à Commencer{' '}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Votre Aventure ?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
              Rejoignez la communauté Campus Téranga et découvrez toutes les opportunités qui vous
              attendent au Sénégal. Votre parcours de réussite commence ici !
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                href="/login"
                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-1 hover:scale-105"
              >
                Rejoindre Maintenant
                <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#contact"
                className="group border-2 border-white/50 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white hover:text-blue-900 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              >
                <ChatBubbleLeftRightIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Nous Contacter
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">100% Sécurisé</span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Communauté Active</span>
              </div>
              <div className="flex items-center">
                <HeartIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Contact Section */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              Contactez-Nous
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Nous sommes{' '}
              <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                là pour vous
              </span>
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Notre équipe est disponible pour vous accompagner dans votre parcours et répondre à
              toutes vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <PhoneIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Téléphone</h3>
              <p className="text-gray-800 text-lg font-medium">+221 77 107 51 58</p>
              <p className="text-sm text-gray-600 mt-2">Disponible 24/7</p>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <EnvelopeIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Email</h3>
              <p className="text-gray-800 text-lg font-medium">contact@campusteranga.sn</p>
              <p className="text-sm text-gray-600 mt-2">Réponse sous 24h</p>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <MapPinIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Adresse</h3>
              <p className="text-gray-800 text-lg font-medium">Dakar, Sénégal</p>
              <p className="text-sm text-gray-600 mt-2">Bureau principal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 to-blue-500/5"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">CT</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                  Campus Téranga
                </span>
              </div>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-md">
                Votre guide complet pour réussir vos études au Sénégal. Formations, événements,
                services et communauté étudiante.
              </p>
              <div className="flex space-x-6">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer group">
                  <GlobeAltIcon className="h-6 w-6 text-gray-400 group-hover:text-white" />
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer group">
                  <PhoneIcon className="h-6 w-6 text-gray-400 group-hover:text-white" />
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer group">
                  <EnvelopeIcon className="h-6 w-6 text-gray-400 group-hover:text-white" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Services</h3>
              <ul className="space-y-4">
                {['Formations', 'Événements', 'Services Étudiants', 'Communauté'].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-lg"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Support</h3>
              <ul className="space-y-4">
                {['Aide', 'Contact', 'FAQ', 'Admin Dashboard'].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-lg"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-lg">
                &copy; 2024 Campus Téranga. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  Politique de confidentialité
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  Conditions d&apos;utilisation
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  Mentions légales
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
