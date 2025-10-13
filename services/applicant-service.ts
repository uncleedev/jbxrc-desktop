import { Applicant, ApplicantCreate, ApplicantUpdate } from "@/types/applicant";
import { supabase } from "../src/lib/supabase";

export const applicantService = {
  async createApplicant(applicant: ApplicantCreate): Promise<Applicant> {
    const { data, error } = await supabase
      .from("applicants")
      .insert([{ ...applicant }])
      .select()
      .single();

    if (error) throw new Error(error.message || "Failed to create applicant");
    return data as Applicant;
  },

  async getApplicants(): Promise<Applicant[]> {
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to fetch applicants");
    return data as Applicant[];
  },

  async getApplicantById(id: string): Promise<Applicant | null> {
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116")
      throw new Error(error.message || "Failed to fetch applicant");

    return data as Applicant | null;
  },

  async updateApplicant(update: ApplicantUpdate): Promise<Applicant> {
    const { id, note, ...changes } = update;

    const { data, error } = await supabase
      .from("applicants")
      .update({
        ...changes,
        status_note: note,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message || "Failed to update applicant");

    return data as Applicant;
  },

  async getStatusHistory(applicantId: string) {
    const { data, error } = await supabase
      .from("applicant_status_history")
      .select("*")
      .eq("applicant_id", applicantId)
      .order("changed_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteApplicant(id: string): Promise<void> {
    const { error } = await supabase.from("applicants").delete().eq("id", id);
    if (error) throw new Error(error.message || "Failed to delete applicant");
  },

  subscribeToApplicants(
    onChange: (event: {
      type: "INSERT" | "UPDATE" | "DELETE";
      new: Applicant | null;
      old: Applicant | null;
    }) => void
  ) {
    const channel = supabase
      .channel("applicants-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applicants" },
        (payload) => {
          onChange({
            type: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new as Applicant,
            old: payload.old as Applicant,
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
};
