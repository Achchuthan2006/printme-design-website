"use client";

import { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { AuthProfileSnapshot, CustomerProfile } from "@/types";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: "customer" | "admin";
  isAdmin: boolean;
  loading: boolean;
  configured: boolean;
  accessToken: string | null;
  profile: CustomerProfile | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [profileState, setProfileState] = useState<AuthProfileSnapshot | null>(null);
  const accessToken = session?.access_token ?? null;
  const role = profileState?.role ?? "customer";
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!supabase || !accessToken) {
      setProfileState(null);
      return;
    }

    const controller = new AbortController();

    fetch("/api/account/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load account profile.");
        }
        return (await response.json()) as AuthProfileSnapshot;
      })
      .then((snapshot) => {
        setProfileState(snapshot);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setProfileState(null);
        }
      });

    return () => controller.abort();
  }, [accessToken, supabase]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  }, [supabase]);

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    session,
    role,
    isAdmin,
    loading,
    configured: Boolean(supabase),
    accessToken,
    profile: profileState?.profile ?? null,
    signOut,
  }), [accessToken, isAdmin, loading, profileState?.profile, role, session, signOut, supabase]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
