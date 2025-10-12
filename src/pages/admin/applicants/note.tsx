import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type NoteDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  action: "promote" | "demote" | "cancel";
};

export default function NoteDialog({
  open,
  onClose,
  onSave,
  action,
}: NoteDialogProps) {
  const { register, handleSubmit, reset } = useForm<{ note: string }>({
    defaultValues: { note: "" },
  });

  const handleSubmitInternal = (data: { note: string }) => {
    onSave(data.note);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit(handleSubmitInternal)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>
              {action === "cancel"
                ? "Cancel Applicant"
                : `${action === "promote" ? "Promote" : "Demote"} Applicant`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Input placeholder="Enter note" {...register("note")} />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
