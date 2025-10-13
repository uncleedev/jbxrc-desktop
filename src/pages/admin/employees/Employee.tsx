import { useEffect, useState } from "react";
import Searchbar from "@/components/shared/searchbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Employee, StationName } from "@/types/employee";
import { useEmployeeStore } from "../../../../stores/useEmployeeStore";
import { useEmployeeStationStore } from "../../../../stores/useEmployeeStationStore";
import SelectStation from "./select-station";
import ViewEmployeeStations from "./view";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, SquarePen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StationFilter = "all" | "no-station" | StationName;

export default function EmployeePage() {
  const { employees, fetchEmployees, loading: empLoading } = useEmployeeStore();
  const {
    stations,
    fetchAllStations,
    addStation,
    deleteStation,
    loading: stationLoading,
  } = useEmployeeStationStore();

  const [typeFilter, setTypeFilter] = useState<
    "all" | "part-time" | "full-time"
  >("all");
  const [stationFilter, setStationFilter] = useState<StationFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [stationDialogOpen, setStationDialogOpen] = useState(false);
  const [viewStationsOpen, setViewStationsOpen] = useState(false);

  const STATION_OPTIONS: StationName[] = [
    "kitchen",
    "counter",
    "dining",
    "drive-thru",
    "jeds",
    "um",
    "sc",
  ];

  useEffect(() => {
    fetchEmployees();
    fetchAllStations();
  }, []);

  const handleStationSave = async (
    employeeId: string,
    selectedStations: StationName[]
  ) => {
    try {
      const currentStations = stations.filter(
        (s) => s.employee_id === employeeId
      );
      const currentStationNames = currentStations.map((s) => s.station_name);

      // Stations to add
      const toAdd = selectedStations.filter(
        (s) => !currentStationNames.includes(s)
      );

      // Stations to delete
      const toDelete = currentStations.filter(
        (s) => s.station_name && !selectedStations.includes(s.station_name)
      );

      // Delete deselected
      for (const s of toDelete) {
        await deleteStation(s.id);
      }

      // Add newly selected with status "initial"
      for (const st of toAdd) {
        await addStation({
          employee_id: employeeId,
          station_name: st,
          status: "initial",
        });
      }

      toast.success("Stations updated successfully!");
      fetchAllStations();
    } catch (err: any) {
      toast.error(`Failed to update stations: ${err.message}`);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesType = typeFilter === "all" || emp.type === typeFilter;
    const matchesSearch = emp.fullname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const empStations = stations
      .filter((s) => s.employee_id === emp.id)
      .map((s) => s.station_name);

    const matchesStation =
      stationFilter === "all"
        ? true
        : stationFilter === "no-station"
        ? empStations.length === 0
        : empStations.includes(stationFilter as StationName);

    return matchesType && matchesSearch && matchesStation;
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Employees Management</h2>

      {/* Filters */}
      <div className="flex flex-col gap-4 items-end">
        <div className="w-1/2 flex gap-4 justify-end">
          <Searchbar value={searchTerm} onChange={setSearchTerm} />

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(val) =>
              setTypeFilter(val as "all" | "part-time" | "full-time")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Type</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Station Filter */}
          <Select
            value={stationFilter}
            onValueChange={(val) => setStationFilter(val as StationFilter)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Stations" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Stations</SelectItem>
                <SelectItem value="no-station">No Station</SelectItem>
                {STATION_OPTIONS.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Employee Table */}
        <div className="rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empLoading || stationLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((emp) => {
                  const empStations = stations
                    .filter((s) => s.employee_id === emp.id)
                    .map((s) => s.station_name);

                  return (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.fullname}</TableCell>
                      <TableCell>{emp.type}</TableCell>
                      <TableCell>
                        {empStations.length > 0
                          ? empStations.join(", ")
                          : "No Station"}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCurrentEmployee(emp);
                                  setViewStationsOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" /> View
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCurrentEmployee(emp);
                                  setStationDialogOpen(true);
                                }}
                              >
                                <SquarePen className="mr-2 h-4 w-4" /> Edit
                                Station
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Select Station Dialog */}
      {currentEmployee && (
        <SelectStation
          open={stationDialogOpen}
          onClose={() => setStationDialogOpen(false)}
          stations={STATION_OPTIONS}
          selected={stations
            .filter((s) => s.employee_id === currentEmployee.id)
            .map((s) => s.station_name)
            .filter((s): s is StationName => s !== null)}
          onSave={(vals) => {
            handleStationSave(currentEmployee.id, vals);
            setStationDialogOpen(false);
          }}
        />
      )}

      {/* View Employee Stations Dialog */}
      {currentEmployee && (
        <ViewEmployeeStations
          employee={currentEmployee}
          open={viewStationsOpen}
          onClose={() => setViewStationsOpen(false)}
        />
      )}
    </section>
  );
}
