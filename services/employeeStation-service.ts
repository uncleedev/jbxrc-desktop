import {
  EmployeeStation,
  EmployeeStationCreate,
  EmployeeStationUpdate,
} from "../types/employee";
import { supabase } from "../src/lib/supabase";

export const employeeStationService = {
  // Add a new station for an employee
  async addStation(station: EmployeeStationCreate): Promise<EmployeeStation> {
    const { data, error } = await supabase
      .from("employee_stations")
      .insert([{ ...station }])
      .select()
      .single();

    if (error) throw new Error(error.message || "Failed to add station");
    return data as EmployeeStation;
  },

  // Get all stations for a specific employee
  async getStations(employeeId: string): Promise<EmployeeStation[]> {
    const { data, error } = await supabase
      .from("employee_stations")
      .select("*")
      .eq("employee_id", employeeId)
      .order("assigned_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to fetch stations");
    return data as EmployeeStation[];
  },
  async getAllStations(): Promise<EmployeeStation[]> {
    const { data, error } = await supabase
      .from("employee_stations")
      .select("*")
      .order("assigned_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to fetch all stations");
    return data as EmployeeStation[];
  },

  async getStationHistory(stationId: string) {
    const { data, error } = await supabase
      .from("station_status_history")
      .select("id, old_status, new_status, change_at, note")
      .eq("station_id", stationId)
      .order("change_at", { ascending: true });

    if (error)
      throw new Error(error.message || "Failed to fetch station history");
    return data;
  },

  // Update an existing employee station
  async updateStation(
    station: EmployeeStationUpdate
  ): Promise<EmployeeStation> {
    const { id, ...changes } = station;

    const { data, error } = await supabase
      .from("employee_stations")
      .update({ ...changes })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message || "Failed to update station");
    return data as EmployeeStation;
  },

  // Delete a station
  async deleteStation(id: string): Promise<void> {
    const { error } = await supabase
      .from("employee_stations")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message || "Failed to delete station");
  },

  // Subscribe to station changes for an employee
  subscribe(
    employeeId: string,
    onChange: (event: {
      type: "INSERT" | "UPDATE" | "DELETE";
      new: EmployeeStation | null;
      old: EmployeeStation | null;
    }) => void
  ) {
    const channel = supabase
      .channel(`employee-stations-${employeeId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "employee_stations",
          filter: `employee_id=eq.${employeeId}`,
        },
        (payload) => {
          onChange({
            type: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new as EmployeeStation,
            old: payload.old as EmployeeStation,
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
};
