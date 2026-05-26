"use client";

import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

    let cancelled = false;

    fetch("/api/account/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load account profile.");
        }
        return (await response.json()) as AuthProfileSnapshot;
      })
      .then((snapshot) => {
        if (!cancelled) {
          setProfileState(snapshot);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfileState(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, supabase]);

  useEffect(() => {
    if (!supabase) return;

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

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        role,
        isAdmin,
        loading,
        configured: Boolean(supabase),
        accessToken,
        profile: profileState?.profile ?? null,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
