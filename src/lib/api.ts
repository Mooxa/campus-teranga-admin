import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://campus-teranga-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  country: string;
  university: string;
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    city: string;
  };
  category: string;
  image: string;
  organizer: {
    name: string;
    contact: {
      phone: string;
      email: string;
    };
  };
  capacity: number;
  registeredUsers: string[];
  isFree: boolean;
  price: {
    amount: number;
    currency: string;
  };
  requirements: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Formation {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalFormations: number;
  totalServices: number;
  activeUsers: number;
  recentUsers: User[];
}

// Auth API
export const authAPI = {
  login: async (phoneNumber: string, password: string) => {
    const response = await api.post('/auth/login', { phoneNumber, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  // Events
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get('/admin/events');
    return response.data;
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    const response = await api.post('/admin/events', eventData);
    return response.data;
  },

  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/admin/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/admin/events/${id}`);
  },

  // Formations
  getFormations: async (): Promise<Formation[]> => {
    const response = await api.get('/admin/formations');
    return response.data;
  },

  createFormation: async (formationData: Partial<Formation>): Promise<Formation> => {
    const response = await api.post('/admin/formations', formationData);
    return response.data;
  },

  updateFormation: async (id: string, formationData: Partial<Formation>): Promise<Formation> => {
    const response = await api.put(`/admin/formations/${id}`, formationData);
    return response.data;
  },

  deleteFormation: async (id: string): Promise<void> => {
    await api.delete(`/admin/formations/${id}`);
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const response = await api.get('/admin/services');
    return response.data;
  },

  createService: async (serviceData: Partial<Service>): Promise<Service> => {
    const response = await api.post('/admin/services', serviceData);
    return response.data;
  },

  updateService: async (id: string, serviceData: Partial<Service>): Promise<Service> => {
    const response = await api.put(`/admin/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/admin/services/${id}`);
  },
};

export default api;
