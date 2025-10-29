"use client";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types";
import { useEffect } from "react";

export function useAuth() {
  const { user, setUser, setLoading, setMustChangePassword } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("useAuth: Error getting session:", error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
        return;
      }

      setUser(data as User);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Heuristic: if matches our temp pattern, force change
    if (/Aa![0-9]{3,}$/.test(password)) {
      setMustChangePassword(true);
    } else {
      setMustChangePassword(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      throw error;
    }
  };

  return {
    user,
    signIn,
    signOut,
    resetPassword,
  };
}
