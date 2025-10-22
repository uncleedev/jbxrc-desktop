import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProductStore } from "../../../../stores/useProductStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

import { ProductCreate } from "@/types/product";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().optional(),
  mp: z.number().min(0),
  sp: z.number().min(0),
  pt: z.number().min(0),
  mc: z.string().optional(),
  cc: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

type AddProductDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddProductDialog({
  open,
  onClose,
}: AddProductDialogProps) {
  const { addProduct, categories } = useProductStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    await addProduct(data as ProductCreate, file || undefined);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Enter product details below</DialogDescription>
          </DialogHeader>

          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input placeholder="Product name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(v) =>
                setValue("category", v === "none" ? undefined : v)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Prices */}
          <div className="flex gap-2">
            <div>
              <Label>MP</Label>
              <Input
                type="number"
                {...register("mp", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>SP</Label>
              <Input
                type="number"
                {...register("sp", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>PT</Label>
              <Input
                type="number"
                {...register("pt", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* MC & CC */}
          <div className="flex gap-2">
            <div>
              <Label>MC</Label>
              <Input {...register("mc")} />
            </div>
            <div>
              <Label>CC</Label>
              <Input {...register("cc")} />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Product Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover border"
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
