import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { authService } from "../services/auth-service";
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
      const session = await authService.signin(email, password);
      set({ user: session?.user ?? null, session: session ?? null });
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
      await authService.signOut();
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
      const session = await authService.getSession();
      set({ user: session?.user ?? null, session: session ?? null });
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
      await authService.updatePassword(newPassword);
      // Refresh session after password update
      const session = await authService.getSession();
      set({ user: session?.user ?? null, session: session ?? null });
      toast.success("Password updated successfully!");
    } catch (err: any) {
      set({ error: err.message || "Failed to update password" });
      toast.error(err.message || "Failed to update password");
    } finally {
      set({ loading: false });
    }
  },
}));
