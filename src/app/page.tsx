'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.role === 'admin' || user.role === 'super_admin') {
          router.replace('/dashboard');
        } else {
          // Regular users stay on landing or can browse formations/events/services
          router.replace('/landing');
        }
      } else {
        // User is not authenticated, redirect to landing page
        router.replace('/landing');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-300 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-900">Campus Téranga</h3>
            <p className="text-sm text-neutral-500">Chargement en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  // This should not render as we redirect immediately
  return null;
}