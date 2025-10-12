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
import { Applicant } from "@/types/applicant";
import { applicantService } from "../../../../services/applicant-service";

type ViewApplicantProps = {
  applicant: Applicant;
  open: boolean;
  onClose: () => void;
};

type StatusHistory = {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_at: string;
  note?: string;
};

export default function ViewApplicant({
  applicant,
  open,
  onClose,
}: ViewApplicantProps) {
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await applicantService.getStatusHistory(applicant.id);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch status history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [open, applicant.id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Applicant Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p>
              <strong>Full Name:</strong> {applicant.fullname}
            </p>
            <p>
              <strong>Type:</strong> {applicant.type}
            </p>
            <p>
              <strong>Current Status:</strong> {applicant.status}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(applicant.created_at).toLocaleString()}
            </p>
            {applicant.updated_at && (
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(applicant.updated_at).toLocaleString()}
              </p>
            )}
          </div>

          <div className="rounded-md border overflow-x-auto">
            <h3 className="font-semibold px-4 py-2">Status History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Old Status</TableHead>
                  <TableHead>New Status</TableHead>
                  <TableHead>Changed At</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Loading history...
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No status history.
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="capitalize">
                        {h.old_status || "-"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {h.new_status}
                      </TableCell>
                      <TableCell>
                        {new Date(h.changed_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{h.note || "-"}</TableCell>
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
