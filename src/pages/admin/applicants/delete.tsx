import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApplicantStore } from "../../../../stores/useApplicantStore";
import { toast } from "sonner";
import { useState } from "react";

type DeleteApplicantProps = {
  applicantId: string;
  open: boolean;
  onClose: () => void;
};

export default function DeleteApplicant({
  applicantId,
  open,
  onClose,
}: DeleteApplicantProps) {
  const { deleteApplicant } = useApplicantStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteApplicant(applicantId);
      toast.success("Applicant deleted successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to delete applicant.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Applicant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this applicant? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
