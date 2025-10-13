import { useEffect, useState } from "react";
import { useApplicantStore } from "../../../stores/useApplicantStore";
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

export default function DashboardPage() {
  const { applicants, fetchApplicants, loading } = useApplicantStore();
  const [recentApplicants, setRecentApplicants] = useState<typeof applicants>(
    []
  );

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

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

  const totalApplicants = applicants.length;
  const totalCancelled = applicants.filter(
    (a) => a.status === "cancelled"
  ).length;
  const totalDeployed = applicants.filter(
    (a) => a.status === "deployed"
  ).length;

  // New statistics
  const totalFullTime = applicants.filter((a) => a.type === "full-time").length;
  const totalPartTime = applicants.filter((a) => a.type === "part-time").length;
  const statusCounts = applicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const recentDeployments = [...applicants]
    .filter((a) => a.status === "deployed")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <section className="flex flex-col gap-6 p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle>Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalApplicants}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardHeader>
            <CardTitle>Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-red-600">
              {totalCancelled}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle>Deployed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-green-600">
              {totalDeployed}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle>Full-Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalFullTime}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardHeader>
            <CardTitle>Part-Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalPartTime}</p>
          </CardContent>
        </Card>
      </div>

      {/* Applicants by Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="border-l-4 border-gray-500">
            <CardHeader>
              <CardTitle className="capitalize">{status}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applicants Table */}
      <div className="rounded-md border overflow-x-auto bg-white shadow-sm">
        <h2 className="text-xl font-semibold px-4 py-2 border-b">
          Recent Applicants
        </h2>
        {loading ? (
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

      {/* Recent Deployments Table */}
      <div className="rounded-md border overflow-x-auto bg-white shadow-sm">
        <h2 className="text-xl font-semibold px-4 py-2 border-b">
          Recent Deployments
        </h2>
        {recentDeployments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No deployments found.
          </div>
        ) : (
          <Table className="min-w-full table-auto sm:table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Deployed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeployments.map((a) => (
                <TableRow key={a.id} className="hover:bg-gray-50">
                  <TableCell className="truncate">{a.fullname}</TableCell>
                  <TableCell className="capitalize">{a.type}</TableCell>
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
