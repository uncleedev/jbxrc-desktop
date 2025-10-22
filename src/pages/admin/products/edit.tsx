import { useState, useEffect } from "react";
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

import { ProductUpdate } from "@/types/product";

const productSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  mp: z.number().min(0),
  sp: z.number().min(0),
  pt: z.number().min(0),
  mc: z.string().optional(),
  cc: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

type EditProductDialogProps = {
  open: boolean;
  onClose: () => void;
  product: ProductUpdate;
  categories: { id: string; label: string }[];
};

export default function EditProductDialog({
  open,
  onClose,
  product,
  categories,
}: EditProductDialogProps) {
  const { updateProduct } = useProductStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product.image_url ?? null);

  const defaultValues: ProductFormData = {
    name: product.name ?? "", // ensure it's always a string
    category: product.category ?? undefined,
    mp: product.mp ?? 0,
    sp: product.sp ?? 0,
    pt: product.pt ?? 0,
    mc: product.mc ?? undefined,
    cc: product.cc ?? undefined,
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormData) => {
    await updateProduct({ ...product, ...data }, file || undefined);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  useEffect(() => {
    setPreview(product.image_url ?? null);
  }, [product]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details below</DialogDescription>
          </DialogHeader>

          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(v) => setValue("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">None</SelectItem>
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
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
