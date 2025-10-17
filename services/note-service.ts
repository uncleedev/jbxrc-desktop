import { supabase } from "../src/lib/supabase";

export interface Note {
  id?: string;
  created_at?: string;
  text: string;
}

export const noteService = {
  // 🔄 Insert or update the note
  async updateAndInsert(note: Partial<Note>) {
    const { data, error } = await supabase
      .from("notes")
      .upsert([note], { onConflict: "id" })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  // 📄 Fetch the most recent note
  async fetchLatest() {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error; // ignore "no rows"
    return data;
  },
};
