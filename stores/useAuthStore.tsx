import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  signin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user ?? null, session: data.session ?? null });
      toast.success("Signed in successfully!");
    } catch (err: any) {
      set({ error: err.message || "Failed to sign in" });
      toast.error(err.message || "Failed to sign in");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
      toast.success("Signed out successfully!");
    } catch (err: any) {
      set({ error: err.message || "Failed to sign out" });
      toast.error(err.message || "Failed to sign out");
    } finally {
      set({ loading: false });
    }
  },

  getSession: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      set({
        user: data.session?.user ?? null,
        session: data.session ?? null,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to get session" });
      toast.error(err.message || "Failed to get session");
    } finally {
      set({ loading: false });
    }
  },

  updatePassword: async (newPassword) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      const { data } = await supabase.auth.getSession();
      set({ user: data.session?.user ?? null, session: data.session ?? null });
      toast.success("Password updated successfully!");
    } catch (err: any) {
      set({ error: err.message || "Failed to update password" });
      toast.error(err.message || "Failed to update password");
    } finally {
      set({ loading: false });
    }
  },
}));

// ✅ Add session listener
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.getState();

  if (["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)) {
    useAuthStore.setState({
      session,
      user: session?.user ?? null,
    });
  }

  if (event === "SIGNED_OUT") {
    useAuthStore.setState({
      session: null,
      user: null,
    });
  }
});
