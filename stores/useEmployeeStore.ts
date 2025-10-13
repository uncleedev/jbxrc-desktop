import { create } from "zustand";
import { Employee } from "../types/employee";
import { employeeService } from "../services/employee-service";
import { toast } from "sonner";

type EmployeeState = {
  employees: Employee[];
  loading: boolean;
  error: string | null;

  fetchEmployees: () => Promise<void>;
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    try {
      set({ loading: true });
      const data = await employeeService.getEmployees();
      set({ employees: data, loading: false, error: null });
    } catch (err: any) {
      set({ loading: false, error: err.message });
      toast.error(`Failed to fetch employees: ${err.message}`);
    }
  },
}));
