import { Employee } from "../types/employee";
import { supabase } from "../src/lib/supabase";

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("deployed_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to fetch employees");
    return data as Employee[];
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message || "Failed to fetch employee");
    }
    return data as Employee | null;
  },
};
