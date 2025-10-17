import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { NotebookPen } from "lucide-react";
import { noteService } from "../../../../services/note-service";
import { toast } from "sonner";

interface NoteForm {
  id?: string;
  text: string;
}

export default function AdminNote() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<NoteForm>({
    defaultValues: { text: "" },
  });

  useEffect(() => {
    const loadNote = async () => {
      try {
        const note = await noteService.fetchLatest();
        if (note) reset(note);
      } catch (err) {
        console.error("❌ Failed to load note:", err);
      }
    };
    loadNote();
  }, [reset]);

  const onSubmit = async (data: NoteForm) => {
    try {
      setIsSubmitting(true);
      const savedNote = await noteService.updateAndInsert(data);
      reset(savedNote);
      toast.success("Note saved");
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <NotebookPen />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
            <DialogDescription>Admin notes editor</DialogDescription>
          </DialogHeader>

          <Textarea
            {...register("text", { required: true })}
            placeholder="Write your note here..."
            cols={20}
            className="h-96 resize-none"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
