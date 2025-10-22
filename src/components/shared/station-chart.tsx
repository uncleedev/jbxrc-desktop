import { useEffect, useState } from "react";
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
    fetchAllStations(); // fetch all for initial chart
  }, [fetchEmployees, fetchAllStations]);

  useEffect(() => {
    if (selectedEmployeeId) fetchStations(selectedEmployeeId);
    else fetchAllStations();
  }, [selectedEmployeeId, fetchStations, fetchAllStations]);

  // Prepare chart data
  const chartData = (() => {
    if (selectedEmployeeId) {
      // Single employee view: all stations
      return stations.map((s) => ({
        station: s.station_name || "Unassigned",
        statusValue: STATUS_ORDER.indexOf(s.status),
        statusLabel: s.status,
      }));
    } else {
      // All employees view: selected station
      return employees.map((e) => {
        const station = stations.find(
          (s) =>
            s.employee_id === e.id &&
            (selectedStation === "all" || s.station_name === selectedStation)
        );
        return {
          station: e.fullname,
          statusValue: station ? STATUS_ORDER.indexOf(station.status) : 0,
          statusLabel: station ? station.status : "no-status",
        };
      });
    }
  })();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Employee Station Status</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Employee dropdown */}
        <div className="space-x-4">
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="border rounded-md p-2 mb-2 w-full sm:w-1/3"
          >
            <option value="">All Employees</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullname}
              </option>
            ))}
          </select>

          {/* Station dropdown (only when viewing all employees) */}
          {!selectedEmployeeId && (
            <select
              value={selectedStation}
              onChange={(e) =>
                setSelectedStation(e.target.value as StationName | "all")
              }
              className="border rounded-md p-2 mb-4 w-full sm:w-1/3"
            >
              <option value="all">All Stations</option>
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
                <option key={station} value={station} className="capitalize">
                  {station}
                </option>
              ))}
            </select>
          )}
        </div>

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
                <LabelList dataKey="statusLabel" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
