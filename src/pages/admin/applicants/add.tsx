import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Plus } from "lucide-react";
import { useApplicantStore } from "../../../../stores/useApplicantStore";

const applicantSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  type: z.enum(["part-time", "full-time"], {
    message: "Select employment type",
  }),
});

type ApplicantFormData = z.infer<typeof applicantSchema>;

export default function AddApplicant() {
  const { addApplicant } = useApplicantStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
    defaultValues: { fullname: "", type: "part-time" },
  });

  const onSubmit = async (data: ApplicantFormData) => {
    await addApplicant({
      fullname: data.fullname,
      type: data.type,
      status: "examination",
    });
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Applicant
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Add New Applicant</DialogTitle>
            <DialogDescription>
              Fill in the applicant’s details below.
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
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
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
