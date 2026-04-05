"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, type AuthUser, type UserRole } from "@/lib/api";
import { clearFmpRoleCookieClient, setFmpRoleCookieClient } from "@/lib/fmp-cookie";
import {
  AUTH_ERROR_REFRESH_FAILED,
  AUTH_ERROR_SESSION_EXPIRED,
  NB_REFRESH_TOKEN_KEY,
} from "@/end-points/http";

export type { UserRole };

export interface User extends AuthUser {
  avatar?: string;
}

type SuccessResult = { success: true; requiresOnboarding: boolean };
type FailedResult = { success: false; error: string };
type AuthResult = SuccessResult | FailedResult;

/** Extended profile stored per user (phone, bio, etc.) */
export interface UserProfile {
  phone?: string;
  bio?: string;
  companyName?: string;
  address?: string;
}

const PROFILE_KEY = "nb_profile";

function getStoredProfile(userId: string): UserProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY}:${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredProfile(userId: string, profile: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PROFILE_KEY}:${userId}`, JSON.stringify(profile));
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  profile: UserProfile;
  requestPhoneOtp: (phone: string) => Promise<{ success: true } | FailedResult>;
  loginWithPhone: (phone: string, code: string, name?: string) => Promise<AuthResult>;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: {
    email?: string;
    name?: string;
    role?: UserRole;
    locationAddress?: string;
    locationCity?: string;
    locationState?: string;
    locationCountry?: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<AuthResult>;
  deleteAccount: () => Promise<{ success: true } | FailedResult>;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, "name">>) => void;
  updateProfileLocal: (updates: UserProfile) => void;
  isAuthenticated: boolean;
  /** True after client has read session from localStorage (matches SSR until then). */
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [profile, setProfileState] = useState<UserProfile>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nb_user");
      const tok = localStorage.getItem("nb_token");
      setUser(stored ? (JSON.parse(stored) as User) : null);
      setToken(tok);
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  useEffect(() => {
    const onAccessTokenUpdated = (e: Event) => {
      const detail = (e as CustomEvent<{ accessToken: string }>).detail;
      if (detail?.accessToken) setToken(detail.accessToken);
    };
    window.addEventListener("fmp-access-token-updated", onAccessTokenUpdated);
    return () => window.removeEventListener("fmp-access-token-updated", onAccessTokenUpdated);
  }, []);

  useEffect(() => {
    setProfileState(user ? getStoredProfile(user.id) : {});
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (user && token) {
      setFmpRoleCookieClient(user.role);
    } else {
      clearFmpRoleCookieClient();
    }
  }, [isAuthReady, user, token]);

  const persistSession = (nextUser: User, accessToken: string) => {
    setUser(nextUser);
    setToken(accessToken);
    localStorage.setItem("nb_user", JSON.stringify(nextUser));
    localStorage.setItem("nb_token", accessToken);
    setFmpRoleCookieClient(nextUser.role);
  };

  const updateStoredUser = (nextUser: User) => {
    setUser(nextUser);
    localStorage.setItem("nb_user", JSON.stringify(nextUser));
    setFmpRoleCookieClient(nextUser.role);
  };

  const requestPhoneOtp = async (phone: string) => {
    try {
      await api.requestPhoneOtp(phone);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unable to send phone OTP",
      };
    }
  };

  const loginWithPhone = async (
    phone: string,
    code: string,
    name?: string,
  ): Promise<AuthResult> => {
    try {
      const result = await api.verifyPhoneOtp({ phone, code, name });
      persistSession(result.user, result.accessToken);
      return { success: true, requiresOnboarding: !result.user.onboardingCompleted };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unable to authenticate with phone",
      };
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const result = await api.getMe(token);
      updateStoredUser(result.user);
    } catch (e) {
      if (e instanceof Error && e.message === AUTH_ERROR_SESSION_EXPIRED) {
        return;
      }
      if (e instanceof Error && e.message === AUTH_ERROR_REFRESH_FAILED) {
        return;
      }
      void logout();
    }
  };

  const updateProfile = async (payload: {
    email?: string;
    name?: string;
    role?: UserRole;
    locationAddress?: string;
    locationCity?: string;
    locationState?: string;
    locationCountry?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<AuthResult> => {
    try {
      const result = await api.updateMe(payload);
      persistSession(result.user, result.accessToken);
      return { success: true, requiresOnboarding: !result.user.onboardingCompleted };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unable to update profile",
      };
    }
  };

  const deleteAccount = async () => {
    try {
      await api.deleteMe();
      logout();
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unable to delete account",
      };
    }
  };

  const logout = async () => {
    clearFmpRoleCookieClient();
    setUser(null);
    setToken(null);
    localStorage.removeItem("nb_user");
    localStorage.removeItem("nb_token");
    localStorage.removeItem(NB_REFRESH_TOKEN_KEY);
    try {
      await api.logout();
    } catch {
      /* session already invalid */
    }
  };

  const updateUser = (updates: Partial<Pick<User, "name">>) => {
    if (!user) return;
    const next = { ...user, ...updates };
    setUser(next);
    localStorage.setItem("nb_user", JSON.stringify(next));
  };

  const updateProfileLocal = (updates: UserProfile) => {
    if (!user) return;
    const next = { ...profile, ...updates };
    setStoredProfile(user.id, next);
    setProfileState(next);
  };

  useEffect(() => {
    if (token) {
      void refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        requestPhoneOtp,
        loginWithPhone,
        refreshUser,
        updateProfile,
        deleteAccount,
        logout,
        updateUser,
        updateProfileLocal,
        isAuthenticated: !!user && !!token,
        isAuthReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
