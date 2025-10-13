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

export default function DashboardPage() {
  const { applicants, fetchApplicants } = useApplicantStore();
  const [recentApplicants, setRecentApplicants] = useState<typeof applicants>(
    []
  );

  useEffect(() => {
    fetchApplicants().then(() => {
      // Show latest 5 applicants
      setRecentApplicants(
        [...applicants]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5)
      );
    });
  }, [fetchApplicants, applicants]);

  const totalApplicants = applicants.length;
  const totalCancelled = applicants.filter(
    (a) => a.status === "cancelled"
  ).length;
  const totalDeployed = applicants.filter(
    (a) => a.status === "deployment"
  ).length;

  return (
    <section className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalApplicants}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancelled Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-red-600">
              {totalCancelled}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployed Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-green-600">
              {totalDeployed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applicants Table */}
      <div className="rounded-md border overflow-x-auto">
        <h2 className="text-xl font-semibold px-4 py-2">Recent Applicants</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No applicants found.
                </TableCell>
              </TableRow>
            ) : (
              recentApplicants.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.fullname}</TableCell>
                  <TableCell>{a.type}</TableCell>
                  <TableCell
                    className={`capitalize ${
                      a.status === "cancelled"
                        ? "text-red-600"
                        : a.status === "deployment"
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    {a.status}
                  </TableCell>
                  <TableCell>
                    {new Date(a.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
