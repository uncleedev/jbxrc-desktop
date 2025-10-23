import { create } from "zustand";
import emailjs from "emailjs-com";
import {
  Applicant,
  ApplicantCreate,
  ApplicantUpdate,
  ApplicantStatus,
} from "@/types/applicant";
import { applicantService } from "../services/applicant-service";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type ApplicantState = {
  applicants: Applicant[];
  loading: boolean;
  error: string | null;

  fetchApplicants: () => Promise<void>;
  addApplicant: (data: ApplicantCreate) => Promise<void>;
  updateApplicant: (data: ApplicantUpdate) => Promise<void>;
  deleteApplicant: (id: string) => Promise<void>;

  promoteApplicant: (id: string, note?: string) => Promise<void>;
  demoteApplicant: (id: string, note?: string) => Promise<void>;
  cancelApplicant: (id: string, note?: string) => Promise<void>;
  deployApplicant: (id: string, note?: string) => Promise<void>;

  subscribe: () => void;
  unsubscribe: () => void;
};

let unsubscribeFn: (() => void) | null = null;

export const useApplicantStore = create<ApplicantState>((set, get) => ({
  applicants: [],
  loading: false,
  error: null,

  fetchApplicants: async () => {
    try {
      set({ loading: true });
      const data = await applicantService.getApplicants();
      set({ applicants: data, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addApplicant: async (data) => {
    try {
      await applicantService.createApplicant(data);
      get().fetchApplicants();
      toast.success("Applicant added successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to add applicant: ${err.message}`);
      throw err;
    }
  },

  updateApplicant: async (data) => {
    try {
      await applicantService.updateApplicant(data);
      get().fetchApplicants();
      toast.success("Applicant updated successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to update applicant: ${err.message}`);
      throw err;
    }
  },

  deleteApplicant: async (id) => {
    try {
      await applicantService.deleteApplicant(id);
      set((state) => ({
        applicants: state.applicants.filter((a) => a.id !== id),
      }));
      toast.success("Applicant deleted successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to delete applicant: ${err.message}`);
      throw err;
    }
  },

  promoteApplicant: async (id: string, note?: string) => {
    try {
      const { applicants, updateApplicant } = get();
      const applicant = applicants.find((a) => a.id === id);
      if (!applicant) return;

      const STATUS_ORDER: ApplicantStatus[] = [
        "no-status",
        "examination",
        "interview",
        "requirements",
        "deployment",
        "orientation",
      ];

      const currentIndex = STATUS_ORDER.indexOf(applicant.status);
      if (currentIndex < STATUS_ORDER.length - 1) {
        const nextStatus = STATUS_ORDER[currentIndex + 1];
        await updateApplicant({ id, status: nextStatus, note });
        toast.success(`Applicant promoted to ${nextStatus}`);
      }
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to promote applicant: ${err.message}`);
      throw err;
    }
  },

  cancelApplicant: async (id: string, note?: string) => {
    try {
      const { updateApplicant } = get();
      await updateApplicant({ id, status: "cancelled", note });
      toast.success("Applicant has been cancelled");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to cancel applicant: ${err.message}`);
      throw err;
    }
  },

  deployApplicant: async (id: string, note?: string) => {
    try {
      const { updateApplicant, applicants } = get();
      const user = applicants.find((u) => u.id === id);
      if (!user) throw new Error("Applicant not found.");

      // Generate a random password
      const base = user.fullname.replace(/\s+/g, "").toLowerCase();
      const random = Math.random().toString(36).slice(-4);
      const password = `${base}${random}`;

      // Create Supabase user account
      const { error: supabaseError } = await supabase.auth.signUp({
        email: user.email,
        password,
      });

      if (supabaseError) throw new Error(supabaseError.message);

      // Send deployment email via EmailJS
      const templateParams = {
        name: user.fullname,
        email: user.email,
        password,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string
      );

      await updateApplicant({ id, status: "deployed", note });

      toast.success("Applicant has been deployed and email sent successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Deployment failed: ${err.message}`);
      throw err;
    }
  },

  demoteApplicant: async (id: string, note?: string) => {
    try {
      const { applicants, updateApplicant } = get();
      const applicant = applicants.find((a) => a.id === id);
      if (!applicant) return;

      const STATUS_ORDER: ApplicantStatus[] = [
        "no-status",
        "examination",
        "interview",
        "requirements",
        "deployment",
        "orientation",
      ];

      const currentIndex = STATUS_ORDER.indexOf(applicant.status);
      if (currentIndex > 0) {
        const prevStatus = STATUS_ORDER[currentIndex - 1];
        await updateApplicant({ id, status: prevStatus, note });
        toast.success(`Applicant demoted to ${prevStatus}`);
      }
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to demote applicant: ${err.message}`);
      throw err;
    }
  },

  subscribe: () => {
    if (unsubscribeFn) return;

    unsubscribeFn = applicantService.subscribeToApplicants((event) => {
      set((state) => {
        switch (event.type) {
          case "INSERT":
            return { applicants: [event.new!, ...state.applicants] };
          case "UPDATE":
            return {
              applicants: state.applicants.map((a) =>
                a.id === event.new!.id ? event.new! : a
              ),
            };
          case "DELETE":
            return {
              applicants: state.applicants.filter(
                (a) => a.id !== event.old!.id
              ),
            };
          default:
            return state;
        }
      });
    });
  },

  unsubscribe: () => {
    if (unsubscribeFn) {
      unsubscribeFn();
      unsubscribeFn = null;
    }
  },
}));
