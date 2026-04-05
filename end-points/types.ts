export type UserRole = "admin" | "agent" | "tenant";

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  pendingEmail?: string | null;
  phone?: string | null;
  role: UserRole;
  /** Preferred role for onboarding / routing when the API provides it */
  defaultRole?: UserRole | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onboardingCompleted: boolean;
  locationAddress?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  locationCountry?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
