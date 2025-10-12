import { create } from "zustand";
import {
  Applicant,
  ApplicantCreate,
  ApplicantUpdate,
  ApplicantStatus,
} from "@/types/applicant";
import { applicantService } from "../services/applicant-service";
import { toast } from "sonner";

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
      const applicant = await applicantService.createApplicant(data);
      set((state) => ({ applicants: [applicant, ...state.applicants] }));
      toast.success("Applicant added successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to add applicant: ${err.message}`);
      throw err;
    }
  },

  updateApplicant: async (data) => {
    try {
      const updated = await applicantService.updateApplicant(data);
      set((state) => ({
        applicants: state.applicants.map((a) =>
          a.id === updated.id ? updated : a
        ),
      }));
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

  demoteApplicant: async (id: string, note?: string) => {
    try {
      const { applicants, updateApplicant } = get();
      const applicant = applicants.find((a) => a.id === id);
      if (!applicant) return;

      const STATUS_ORDER: ApplicantStatus[] = [
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
