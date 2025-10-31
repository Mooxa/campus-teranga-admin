'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  AcademicCapIcon,
  CalendarIcon,
  CogIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  UsersIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  UserIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Formation, Event, Service, publicAPI, communityAPI, Community } from '@/lib/api';

interface PublicContent {
  formations: Formation[];
  events: Event[];
  services: Service[];
  communities: Community[];
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<PublicContent>({
    formations: [],
    events: [],
    services: [],
    communities: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'formations' | 'events' | 'services' | 'communities'>('formations');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContent, setFilteredContent] = useState<(Formation | Event | Service | Community)[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'formation' | 'event' | 'service'>('formation');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Filter content based on active tab and search query
    let items: (Formation | Event | Service | Community)[] = [];
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
      case 'communities':
        items = content.communities;
        break;
    }
    
    if (searchQuery) {
      items = items.filter(item => {
        if (activeTab === 'formations') {
          const formation = item as Formation;
          return formation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 formation.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 formation.description?.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (activeTab === 'events') {
          const event = item as Event;
          return event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 event.description?.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (activeTab === 'communities') {
          const community = item as Community;
          return community.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 community.description?.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          const service = item as Service;
          return service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 service.description?.toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }
    
    setFilteredContent(items);
  }, [activeTab, content, searchQuery]);

  const fetchContent = async () => {
    try {
      const [formations, events, services, communities] = await Promise.all([
        publicAPI.getFormations(),
        publicAPI.getEvents(),
        publicAPI.getServices(),
        communityAPI.getCommunities()
      ]);

      setContent({
        formations: Array.isArray(formations) ? formations : [],
        events: Array.isArray(events) ? events : [],
        services: Array.isArray(services) ? services : [],
        communities: Array.isArray(communities) ? communities : []
      });
    } catch {
      // Error handled silently
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
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={() => router.push('/landing')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Retour</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">CT</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  Campus Téranga
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 hover:bg-orange-50 rounded-lg px-3 py-2 transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      Bonjour, {user.fullName}
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
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
                            setIsProfileDropdownOpen(false);
                            router.push('/profile/edit');
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>Modifier le profil</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            if (user.role === 'admin' || user.role === 'super_admin') {
                              router.push('/dashboard');
                            }
                          }}
                          className={`flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${(!user.role || user.role === 'user') ? 'hidden' : ''}`}
                        >
                          <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>Tableau de bord</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
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
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-green-600'
                }`}
              >
                <CogIcon className="h-5 w-5 inline-block mr-2" />
                Services
              </button>
              <button
                onClick={() => setActiveTab('communities')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'communities'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-neutral-600 hover:text-purple-600'
                }`}
              >
                <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
                Communautés
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => {
              const displayName = 'name' in item ? item.name : 'title' in item ? item.title : '';
              const displayImage = 'image' in item ? item.image : undefined;
              const displayShortName = 'shortName' in item ? item.shortName : undefined;
              const displayDescription = 'description' in item ? item.description : '';
              
              return (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {displayImage && (
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={displayImage} alt={displayName || 'Content image'} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {displayName}
                  </h3>
                  {displayShortName && (
                    <p className="text-sm text-neutral-500 mb-3">{displayShortName}</p>
                  )}
                  <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                    {displayDescription}
                  </p>
                  
                  {activeTab === 'formations' && (
                    <>
                      <div className="space-y-2 text-sm text-neutral-500 mb-4">
                        {('programs' in item && item.programs?.length) ? (
                          <div className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-2" />
                            {item.programs.length} programme(s) disponible(s)
                          </div>
                        ) : null}
                        {('location' in item && item.location) ? (
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {item.location.city}
                            {'district' in item.location && item.location.district && `, ${item.location.district}`}
                          </div>
                        ) : null}
                      </div>
                      <button
                      onClick={() => {
                        setSelectedFormation(item as Formation);
                        setModalType('formation');
                        setIsModalOpen(true);
                      }}
                      className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                    >
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                      Voir les programmes
                    </button>
                    </>
                  )}
                  
                  {activeTab === 'events' && (
                    <>
                      <div className="space-y-2 text-sm text-neutral-500 mb-4">
                        {('date' in item && item.date) ? (
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            {new Date(item.date).toLocaleDateString('fr-FR')}
                          </div>
                        ) : null}
                        {('location' in item && item.location) ? (
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {'name' in item.location ? item.location.name : item.location.city}
                          </div>
                        ) : null}
                        {('capacity' in item && item.capacity) ? (
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-2" />
                            {('registeredUsers' in item && item.registeredUsers?.length) || 0} / {item.capacity} participants
                          </div>
                        ) : null}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEvent(item as Event);
                          setModalType('event');
                          setIsModalOpen(true);
                        }}
                        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                      >
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        Voir les détails
                      </button>
                    </>
                  )}
                  
                  {activeTab === 'services' && (
                    <button
                      onClick={() => {
                        setSelectedService(item as Service);
                        setModalType('service');
                        setIsModalOpen(true);
                      }}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                    >
                      <CogIcon className="h-5 w-5 mr-2" />
                      Voir les détails
                    </button>
                  )}

                  {activeTab === 'communities' && (
                    <>
                      <div className="space-y-2 text-sm text-neutral-500 mb-4">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {('members' in item && item.members?.length) || 0} membre(s)
                        </div>
                        <div className="flex items-center">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                          {('posts' in item && item.posts?.length) || 0} publication(s)
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/communities`)}
                        className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                      >
                        <UserGroupIcon className="h-5 w-5 mr-2" />
                        Rejoindre la communauté
                      </button>
                    </>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'formations' && <AcademicCapIcon className="h-12 w-12 text-orange-600" />}
                {activeTab === 'events' && <CalendarIcon className="h-12 w-12 text-orange-600" />}
                {activeTab === 'services' && <CogIcon className="h-12 w-12 text-orange-600" />}
                {activeTab === 'communities' && <UserGroupIcon className="h-12 w-12 text-purple-600" />}
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

      {/* Detail Modal */}
      {isModalOpen && ((modalType === 'formation' && selectedFormation) || (modalType === 'event' && selectedEvent) || (modalType === 'service' && selectedService)) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className={`p-6 text-white ${
              modalType === 'formation' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              modalType === 'event' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              'bg-gradient-to-r from-green-500 to-green-600'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {modalType === 'formation' ? selectedFormation?.name :
                     modalType === 'event' ? selectedEvent?.title :
                     selectedService?.title}
                  </h2>
                  {modalType === 'formation' && selectedFormation?.shortName && (
                    <p className="text-orange-100">{selectedFormation.shortName}</p>
                  )}
                  {(modalType === 'event' || modalType === 'service') && (
                    <p className="opacity-90">
                      {modalType === 'event' ? 'Événement' : 'Service'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFormation(null);
                    setSelectedEvent(null);
                    setSelectedService(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Description</h3>
                <p className="text-neutral-600 mb-4">
                  {modalType === 'formation' ? selectedFormation?.description :
                   modalType === 'event' ? selectedEvent?.description :
                   selectedService?.description}
                </p>
                {/* Detailed Info based on type */}
                {modalType === 'formation' && selectedFormation?.location && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <MapPinIcon className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-semibold text-neutral-900">Localisation</span>
                      </div>
                      <p className="text-neutral-600">{selectedFormation.location.address}</p>
                      <p className="text-neutral-600">{selectedFormation.location.district}, {selectedFormation.location.city}</p>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <AcademicCapIcon className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-semibold text-neutral-900">Type</span>
                      </div>
                      <p className="text-neutral-600 capitalize">{selectedFormation.type}</p>
                    </div>
                  </div>
                )}

                {modalType === 'event' && selectedEvent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEvent.date && (
                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-neutral-900">Date</span>
                        </div>
                        <p className="text-neutral-600">{new Date(selectedEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    )}
                    
                    {selectedEvent.location && (
                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-neutral-900">Localisation</span>
                        </div>
                        <p className="text-neutral-600">{selectedEvent.location.name}</p>
                      </div>
                    )}
                    
                    {selectedEvent.capacity && (
                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <UsersIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-neutral-900">Participants</span>
                        </div>
                        <p className="text-neutral-600">{selectedEvent.registeredUsers?.length || 0} / {selectedEvent.capacity}</p>
                      </div>
                    )}
                  </div>
                )}

                {modalType === 'service' && selectedService && (
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <CogIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-neutral-900">Service</span>
                    </div>
                    <p className="text-neutral-600">{selectedService.title}</p>
                  </div>
                )}
              </div>

              {/* Programs Section - Only for formations */}
              {modalType === 'formation' && selectedFormation && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Programmes ({selectedFormation.programs?.length || 0})
                  </h3>
                  
                  {selectedFormation.programs && selectedFormation.programs.length > 0 ? (
                    <div className="space-y-4">
                      {selectedFormation.programs.map((program, index) => (
                        <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-xl font-bold text-neutral-900">{program.name}</h4>
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {program.level}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center text-neutral-600">
                              <ClockIcon className="h-5 w-5 text-orange-600 mr-2" />
                              <span className="font-medium">Durée:</span>
                              <span className="ml-2">{program.duration}</span>
                            </div>
                            
                            <div className="flex items-center text-neutral-600">
                              <GlobeAltIcon className="h-5 w-5 text-orange-600 mr-2" />
                              <span className="font-medium">Langue:</span>
                              <span className="ml-2">{program.language}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-neutral-50 p-8 rounded-xl text-center">
                      <AcademicCapIcon className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-neutral-600">Aucun programme disponible pour cette formation</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

