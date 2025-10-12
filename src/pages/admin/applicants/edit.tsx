import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApplicantStore } from "../../../../stores/useApplicantStore";
import { toast } from "sonner";

const applicantSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  type: z.enum(["part-time", "full-time"], {
    message: "Select employment type",
  }),
});

type ApplicantFormData = z.infer<typeof applicantSchema>;

type EditApplicantProps = {
  applicant: {
    id: string;
    fullname: string;
    type: "part-time" | "full-time";
  };
  open: boolean;
  onClose: () => void;
};

export default function EditApplicant({
  applicant,
  open,
  onClose,
}: EditApplicantProps) {
  const { updateApplicant } = useApplicantStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
    defaultValues: { fullname: applicant.fullname, type: applicant.type },
  });

  const onSubmit = async (data: ApplicantFormData) => {
    await updateApplicant({
      id: applicant.id,
      fullname: data.fullname,
      type: data.type,
    });
    toast.success("Applicant updated successfully!");
    reset(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit Applicant</DialogTitle>
            <DialogDescription>
              Update the applicant’s details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label>Full Name</Label>
            <Input
              placeholder="Enter applicant’s name"
              {...register("fullname")}
            />
            {errors.fullname && (
              <p className="text-sm text-red-500">{errors.fullname.message}</p>
            )}

            <Label>Employment Type</Label>
            <Select
              onValueChange={(v) =>
                setValue("type", v as "part-time" | "full-time")
              }
              value={watch("type")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="full-time">Full Time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
