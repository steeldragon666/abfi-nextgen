import { useAuth } from './useAuth';

export type UserRole = 'first-time' | 'grower' | 'developer' | 'financier' | 'admin';

export function useUserRole(): UserRole {
  const { user } = useAuth();

  // Check if first-time user
  if (typeof window !== 'undefined') {
    const hasSeenTour = localStorage.getItem('abfi-has-seen-tour');
    const hasSeenOnboarding = localStorage.getItem('abfi_onboarding_completed');
    if (!hasSeenTour && !hasSeenOnboarding) {
      return 'first-time';
    }
  }

  // Map database roles to UI roles
  // Database roles: user, admin, supplier, buyer, auditor
  if (!user) return 'first-time';

  switch (user.role) {
    case 'admin':
      return 'admin';
    case 'auditor':
      return 'financier';
    case 'buyer':
      return 'developer';
    case 'supplier':
    case 'user':
    default:
      return 'grower';
  }
}
