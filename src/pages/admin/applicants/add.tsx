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
import { UserRoundPlus } from "lucide-react";
import { useApplicantStore } from "../../../../stores/useApplicantStore";

const applicantSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  type: z.enum(["working-student", "full-time"], {
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
    defaultValues: { fullname: "", email: "", type: "working-student" },
  });

  const onSubmit = async (data: ApplicantFormData) => {
    await addApplicant({
      fullname: data.fullname,
      email: data.email,
      type: data.type,
      status: "no-status",
    });
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserRoundPlus className="mr-2 h-4 w-4" /> Add Applicant
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

          <div className="space-y-2">
            {/* Full name */}
            <Label>Full Name</Label>
            <Input
              placeholder="Enter applicant’s name"
              {...register("fullname")}
            />
            {errors.fullname && (
              <p className="text-sm text-red-500">{errors.fullname.message}</p>
            )}

            {/* Email */}
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter applicant’s email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            {/* Employment type */}
            <Label>Employment Type</Label>
            <Select
              onValueChange={(v) =>
                setValue("type", v as "working-student" | "full-time")
              }
              value={watch("type")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="working-student">
                    Working Student
                  </SelectItem>
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
