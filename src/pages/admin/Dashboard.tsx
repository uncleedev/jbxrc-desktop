import { useEffect, useState } from "react";
import { useApplicantStore } from "../../../stores/useApplicantStore";
import { useEmployeeStore } from "../../../stores/useEmployeeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import EmployeeStationChart from "@/components/shared/station-chart";

export default function DashboardPage() {
  const {
    applicants,
    fetchApplicants,
    loading: loadingApplicants,
  } = useApplicantStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const [recentApplicants, setRecentApplicants] = useState<typeof applicants>(
    []
  );

  useEffect(() => {
    fetchApplicants();
    fetchEmployees();
  }, [fetchApplicants, fetchEmployees]);

  useEffect(() => {
    setRecentApplicants(
      [...applicants]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5)
    );
  }, [applicants]);

  // Stats
  const totalApplicants = applicants.length;
  const totalDeployed = applicants.filter(
    (a) => a.status === "deployed"
  ).length;
  const totalCancelled = applicants.filter(
    (a) => a.status === "cancelled"
  ).length;
  const totalEmployees = employees.length;
  const totalFullTime = employees.filter((e) => e.type === "full-time").length;
  const totalPartTime = employees.filter(
    (e) => e.type === "working-student"
  ).length;

  return (
    <section className="flex flex-col gap-6 p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle>Applicants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Total Applicants:</span>
              <span className="font-semibold">{totalApplicants}</span>
            </div>
            <div className="flex justify-between">
              <span>Deployed:</span>
              <span className="font-semibold text-green-600">
                {totalDeployed}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled:</span>
              <span className="font-semibold text-red-600">
                {totalCancelled}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Total Employees:</span>
              <span className="font-semibold">{totalEmployees}</span>
            </div>
            <div className="flex justify-between">
              <span>Full-Time:</span>
              <span className="font-semibold text-green-600">
                {totalFullTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Working-Student:</span>
              <span className="font-semibold text-yellow-600">
                {totalPartTime}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Station Status Chart */}
      <EmployeeStationChart />

      {/* Recent Applicants Table */}
      <div className="rounded-md border overflow-x-auto bg-white shadow-sm">
        <h2 className="text-xl font-semibold px-4 py-2 border-b">
          Recent Applicants
        </h2>
        {loadingApplicants ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : recentApplicants.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No applicants found.
          </div>
        ) : (
          <Table className="min-w-full table-auto sm:table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplicants.map((a) => (
                <TableRow key={a.id} className="hover:bg-gray-50">
                  <TableCell className="truncate">{a.fullname}</TableCell>
                  <TableCell className="capitalize">{a.type}</TableCell>
                  <TableCell
                    className={`capitalize font-medium ${
                      a.status === "cancelled"
                        ? "text-red-600"
                        : a.status === "deployed"
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    {a.status}
                  </TableCell>
                  <TableCell>
                    {new Date(a.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
