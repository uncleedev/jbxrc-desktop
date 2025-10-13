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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee, EmployeeStation } from "@/types/employee";
import { useEmployeeStationStore } from "../../../../stores/useEmployeeStationStore";

type ViewEmployeeStationsProps = {
  employee: Employee;
  open: boolean;
  onClose: () => void;
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

  useEffect(() => {
    if (!open) return;

    const empStations = stations.filter((s) => s.employee_id === employee.id);
    setEmployeeStations(empStations);
  }, [open, employee.id, stations]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Employee Stations</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p>
              <strong>Full Name:</strong> {employee.fullname}
            </p>
            <p>
              <strong>Type:</strong> {employee.type}
            </p>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <h3 className="font-semibold px-4 py-2">Assigned Stations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeStations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No stations assigned.
                    </TableCell>
                  </TableRow>
                ) : (
                  employeeStations.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="capitalize">
                        {s.station_name}
                      </TableCell>
                      <TableCell className="capitalize">{s.status}</TableCell>
                      <TableCell>
                        {new Date(s.assigned_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => promoteStation(s.id)}
                          disabled={s.status === "recertify"}
                        >
                          ↑ Promote
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => demoteStation(s.id)}
                          disabled={s.status === "initial"}
                        >
                          ↓ Demote
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
