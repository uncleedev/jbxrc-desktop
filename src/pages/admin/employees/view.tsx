import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee, EmployeeStation } from "@/types/employee";
import { useEmployeeStationStore } from "../../../../stores/useEmployeeStationStore";
import { employeeStationService } from "../../../../services/employeeStation-service";

type ViewEmployeeStationsProps = {
  employee: Employee;
  open: boolean;
  onClose: () => void;
};

type StatusHistory = {
  id: number;
  old_status: string | null;
  new_status: string;
  change_at: string;
  note?: string | null;
};

export default function ViewEmployeeStations({
  employee,
  open,
  onClose,
}: ViewEmployeeStationsProps) {
  const { stations, promoteStation, demoteStation } = useEmployeeStationStore();
  const [employeeStations, setEmployeeStations] = useState<EmployeeStation[]>(
    []
  );
  const [histories, setHistories] = useState<Record<string, StatusHistory[]>>(
    {}
  );

  useEffect(() => {
    if (!open) return;

    const empStations = stations.filter(
      (s) => s.employee_id === employee.id && s.status
    );
    setEmployeeStations(empStations);

    const fetchHistories = async () => {
      const allHistories: Record<string, StatusHistory[]> = {};
      for (const s of empStations) {
        const data = await employeeStationService.getStationHistory(s.id);
        allHistories[s.id] = data;
      }
      setHistories(allHistories);
    };

    fetchHistories();
  }, [open, employee.id, stations]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95vw] sm:max-w-3xl
          max-h-[90vh] p-0
          flex flex-col
        "
      >
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Station Status History
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content area */}
        <div
          className="
            flex-1 overflow-y-auto
            p-4 space-y-4
          "
        >
          <div className="text-sm">
            <p>
              <strong>Full Name:</strong> {employee.fullname}
            </p>
            <p>
              <strong>Type:</strong> {employee.type}
            </p>
          </div>

          {employeeStations.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-6">
              No station assignments found.
            </div>
          ) : (
            employeeStations.map((station) => (
              <div
                key={station.id}
                className="rounded-lg border shadow-sm overflow-hidden bg-card"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                  <h3 className="font-semibold capitalize text-base">
                    {station.station_name ?? "Unknown Station"}
                  </h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => promoteStation(station.id)}
                      disabled={station.status === "recertify"}
                    >
                      ↑ Promote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => demoteStation(station.id)}
                      disabled={station.status === "initial"}
                    >
                      ↓ Demote
                    </Button>
                  </div>
                </div>

                {/* Status History */}
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-2 text-foreground/90">
                    Status History
                  </h4>

                  {histories[station.id]?.length ? (
                    <ul className="border-l pl-4 space-y-3">
                      {histories[station.id].map((h) => (
                        <li key={h.id} className="relative">
                          <div className="absolute -left-2 top-1 w-2 h-2 bg-primary rounded-full" />
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="capitalize font-medium text-sm">
                              {h.new_status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(h.change_at).toLocaleString()}
                            </span>
                          </div>
                          {h.note && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {h.note}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No history yet.
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="p-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
