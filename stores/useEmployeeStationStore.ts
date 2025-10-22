import { create } from "zustand";
import {
  EmployeeStation,
  EmployeeStationCreate,
  EmployeeStationUpdate,
  StationStatus,
} from "../types/employee";
import { toast } from "sonner";
import { employeeStationService } from "../services/employeeStation-service";

type EmployeeStationState = {
  stations: EmployeeStation[];
  loading: boolean;
  error: string | null;

  fetchStations: (employeeId: string) => Promise<void>;
  fetchAllStations: () => Promise<void>;
  addStation: (data: EmployeeStationCreate) => Promise<void>;
  updateStation: (data: EmployeeStationUpdate) => Promise<void>;
  deleteStation: (id: string) => Promise<void>;

  promoteStation: (id: string) => Promise<void>;
  demoteStation: (id: string) => Promise<void>;

  subscribe: (employeeId: string) => void;
  unsubscribe: () => void;
};

let unsubscribeFn: (() => void) | null = null;

export const useEmployeeStationStore = create<EmployeeStationState>(
  (set, get) => ({
    stations: [],
    loading: false,
    error: null,

    fetchStations: async (employeeId: string) => {
      try {
        set({ loading: true, error: null });
        const data = await employeeStationService.getStations(employeeId);
        set({ stations: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
        toast.error(`Failed to fetch stations: ${err.message}`);
      }
    },

    fetchAllStations: async () => {
      try {
        set({ loading: true, error: null });
        const data = await employeeStationService.getAllStations();
        set({ stations: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
        toast.error(`Failed to fetch all stations: ${err.message}`);
      }
    },

    addStation: async (data: EmployeeStationCreate) => {
      try {
        const newStation = await employeeStationService.addStation({
          ...data,
          status: "no-status",
        });
        set((state) => ({ stations: [newStation, ...state.stations] }));
        toast.success("Station added successfully!");
      } catch (err: any) {
        set({ error: err.message });
        toast.error(`Failed to add station: ${err.message}`);
        throw err;
      }
    },

    updateStation: async (data: EmployeeStationUpdate) => {
      try {
        const updated = await employeeStationService.updateStation(data);
        set((state) => ({
          stations: state.stations.map((s) =>
            s.id === updated.id ? updated : s
          ),
        }));
        toast.success("Station updated successfully!");
      } catch (err: any) {
        set({ error: err.message });
        toast.error(`Failed to update station: ${err.message}`);
        throw err;
      }
    },

    deleteStation: async (id: string) => {
      try {
        await employeeStationService.deleteStation(id);
        set((state) => ({
          stations: state.stations.filter((s) => s.id !== id),
        }));
        toast.success("Station deleted successfully!");
      } catch (err: any) {
        set({ error: err.message });
        toast.error(`Failed to delete station: ${err.message}`);
        throw err;
      }
    },

    // Promote station status
    promoteStation: async (id: string) => {
      try {
        const { stations, updateStation } = get();
        const station = stations.find((s) => s.id === id);
        if (!station) return;

        const STATUS_ORDER: StationStatus[] = [
          "no-status",
          "initial",
          "follow-up",
          "certify",
          "recertify",
        ];
        const currentIndex = STATUS_ORDER.indexOf(station.status);
        if (currentIndex < STATUS_ORDER.length - 1) {
          const nextStatus = STATUS_ORDER[currentIndex + 1];
          await updateStation({ id, status: nextStatus });
          toast.success(`Station promoted to ${nextStatus}`);
        }
      } catch (err: any) {
        set({ error: err.message });
        toast.error(`Failed to promote station: ${err.message}`);
        throw err;
      }
    },

    // Demote station status
    demoteStation: async (id: string) => {
      try {
        const { stations, updateStation } = get();
        const station = stations.find((s) => s.id === id);
        if (!station) return;

        const STATUS_ORDER: StationStatus[] = [
          "initial",
          "follow-up",
          "certify",
          "recertify",
        ];
        const currentIndex = STATUS_ORDER.indexOf(station.status);
        if (currentIndex > 0) {
          const prevStatus = STATUS_ORDER[currentIndex - 1];
          await updateStation({ id, status: prevStatus });
          toast.success(`Station demoted to ${prevStatus}`);
        }
      } catch (err: any) {
        set({ error: err.message });
        toast.error(`Failed to demote station: ${err.message}`);
        throw err;
      }
    },

    subscribe: (employeeId: string) => {
      if (unsubscribeFn) return;

      unsubscribeFn = employeeStationService.subscribe(employeeId, (event) => {
        set((state) => {
          switch (event.type) {
            case "INSERT":
              return { stations: [event.new!, ...state.stations] };
            case "UPDATE":
              return {
                stations: state.stations.map((s) =>
                  s.id === event.new!.id ? event.new! : s
                ),
              };
            case "DELETE":
              return {
                stations: state.stations.filter((s) => s.id !== event.old!.id),
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
  })
);
