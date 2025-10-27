'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  AcademicCapIcon,
  CalendarIcon,
  CogIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Formation, Event, Service } from '@/lib/api';

interface PublicContent {
  formations: Formation[];
  events: Event[];
  services: Service[];
}

export default function HomePage() {
  const { user } = useAuth();
  const [content, setContent] = useState<PublicContent>({
    formations: [],
    events: [],
    services: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'formations' | 'events' | 'services'>('formations');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContent, setFilteredContent] = useState<any[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    // Filter content based on active tab and search query
    let items: any[] = [];
    switch(activeTab) {
      case 'formations':
        items = content.formations;
        break;
      case 'events':
        items = content.events;
        break;
      case 'services':
        items = content.services;
        break;
    }
    
    if (searchQuery) {
      items = items.filter(item => {
        if (activeTab === 'formations') {
          return item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (activeTab === 'events') {
          return item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          return item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }
    
    setFilteredContent(items);
  }, [activeTab, content, searchQuery]);

  const fetchContent = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const [formationsRes, eventsRes, servicesRes] = await Promise.all([
        fetch(`${apiUrl}/api/formations?isActive=true`),
        fetch(`${apiUrl}/api/events?isActive=true`),
        fetch(`${apiUrl}/api/services?isActive=true`)
      ]);

      const formationsJson = await formationsRes.json();
      const eventsJson = await eventsRes.json();
      const servicesJson = await servicesRes.json();

      setContent({
        formations: Array.isArray(formationsJson.data) ? formationsJson.data : (Array.isArray(formationsJson) ? formationsJson : []),
        events: Array.isArray(eventsJson.data) ? eventsJson.data : (Array.isArray(eventsJson) ? eventsJson : []),
        services: Array.isArray(servicesJson.data) ? servicesJson.data : (Array.isArray(servicesJson) ? servicesJson : [])
      });
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-300 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-900">Chargement...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
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
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    Bonjour, {user.fullName}
                  </span>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Bienvenue {user?.fullName || ''}
            </h1>
            <p className="text-lg text-neutral-600">
              Découvrez nos formations, événements et services
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher formations, événements ou services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white p-2 rounded-2xl shadow-sm border border-neutral-200">
              <button
                onClick={() => setActiveTab('formations')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'formations'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-orange-600'
                }`}
              >
                <AcademicCapIcon className="h-5 w-5 inline-block mr-2" />
                Formations
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'events'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-orange-600'
                }`}
              >
                <CalendarIcon className="h-5 w-5 inline-block mr-2" />
                Événements
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'services'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-orange-600'
                }`}
              >
                <CogIcon className="h-5 w-5 inline-block mr-2" />
                Services
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item: any) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {item.image && (
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <img src={item.image} alt={item.name || item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {item.name || item.title}
                  </h3>
                  {item.shortName && (
                    <p className="text-sm text-neutral-500 mb-3">{item.shortName}</p>
                  )}
                  <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                    {item.description}
                  </p>
                  
                  {activeTab === 'formations' && (
                    <div className="space-y-2 text-sm text-neutral-500">
                      {item.programs?.length > 0 && (
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          {item.programs.length} programme(s) disponible(s)
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {item.location.city}, {item.location.district}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'events' && (
                    <div className="space-y-2 text-sm text-neutral-500">
                      {item.date && (
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {new Date(item.date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {item.location.name}
                        </div>
                      )}
                      {item.capacity && (
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-2" />
                          {item.registeredUsers?.length || 0} / {item.capacity} participants
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'formations' && <AcademicCapIcon className="h-12 w-12 text-orange-600" />}
                {activeTab === 'events' && <CalendarIcon className="h-12 w-12 text-orange-600" />}
                {activeTab === 'services' && <CogIcon className="h-12 w-12 text-orange-600" />}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {searchQuery ? 'Aucun résultat trouvé' : 'Aucun contenu disponible'}
              </h3>
              <p className="text-neutral-600">
                {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Contenu bientôt disponible'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

