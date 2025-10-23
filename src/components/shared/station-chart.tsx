import { useEffect, useState, useMemo } from "react";
import { useEmployeeStore } from "../../../stores/useEmployeeStore";
import { useEmployeeStationStore } from "../../../stores/useEmployeeStationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StationStatus, StationName } from "../../../types/employee";

export default function EmployeeStationChart() {
  const { employees, fetchEmployees } = useEmployeeStore();
  const { stations, fetchAllStations, fetchStations, loading } =
    useEmployeeStationStore();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<StationName | "all">(
    "all"
  );

  const STATUS_ORDER: StationStatus[] = [
    "no-status",
    "initial",
    "follow-up",
    "certify",
    "recertify",
  ];

  useEffect(() => {
    fetchEmployees();
    fetchAllStations();
  }, [fetchEmployees, fetchAllStations]);

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchStations(selectedEmployeeId);
    } else {
      fetchAllStations();
    }
  }, [selectedEmployeeId, fetchStations, fetchAllStations]);

  // Filter only employees who actually have stations
  const employeesWithStations = useMemo(() => {
    const assignedIds = new Set(stations.map((s) => s.employee_id));
    return employees.filter((e) => assignedIds.has(e.id));
  }, [employees, stations]);

  // Chart data
  const chartData = useMemo(() => {
    // Single employee view
    if (selectedEmployeeId) {
      return stations.map((s) => ({
        station: s.station_name || "no-station",
        statusValue: STATUS_ORDER.indexOf(s.status),
        statusLabel: s.station_name ? s.status : "no-station",
      }));
    }

    // All employees view
    // Filter employees who have any assigned station
    const filteredEmployees = employeesWithStations.filter((e) => {
      const hasStation = stations.some((s) => s.employee_id === e.id);
      if (!hasStation) return false;

      if (selectedStation === "all") return true;

      // Only include employees assigned to the selected station
      return stations.some(
        (s) => s.employee_id === e.id && s.station_name === selectedStation
      );
    });

    return filteredEmployees.map((e) => {
      const station = stations.find(
        (s) =>
          s.employee_id === e.id &&
          (selectedStation === "all" || s.station_name === selectedStation)
      );

      return {
        station: e.fullname,
        statusValue: station
          ? STATUS_ORDER.indexOf(station.status)
          : STATUS_ORDER.indexOf("no-status"),
        statusLabel: station ? station.status : "no-station",
      };
    });
  }, [selectedEmployeeId, employeesWithStations, stations, selectedStation]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Employee Station Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Employee Select */}
          <div className="w-full sm:w-1/2">
            <Select
              value={selectedEmployeeId || "all"}
              onValueChange={(value) =>
                setSelectedEmployeeId(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employeesWithStations.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.fullname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Station Select (only visible when viewing all employees) */}
          {!selectedEmployeeId && (
            <div className="w-full sm:w-1/2">
              <Select
                value={selectedStation}
                onValueChange={(value) =>
                  setSelectedStation(value as StationName | "all")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Stations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  {[
                    "back-up",
                    "fryman",
                    "grill",
                    "stockman",
                    "pantry",
                    "counter",
                    "dining",
                    "drive-thru",
                    "jeds",
                    "um",
                    "sc",
                  ].map((station) => (
                    <SelectItem
                      key={station}
                      value={station}
                      className="capitalize"
                    >
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Chart Display */}
        {loading ? (
          <p>Loading...</p>
        ) : chartData.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="station" />
              <YAxis
                ticks={[0, 1, 2, 3, 4]}
                tickFormatter={(val) => STATUS_ORDER[val]}
              />
              <Tooltip
                formatter={(_value, _name, props) =>
                  props?.payload?.statusLabel
                }
              />
              <Bar dataKey="statusValue" fill="#4f46e5">
                <LabelList
                  dataKey="statusLabel"
                  position="top"
                  formatter={(value) =>
                    value === "no-station" ? "No Station" : value
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
