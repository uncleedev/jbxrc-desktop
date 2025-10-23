import { useState, useEffect } from "react";
import { useProductStore } from "../../../../../stores/useProductStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type EditCategoryDialogProps = {
  categoryId: string;
  open: boolean;
  onClose: () => void;
};

export default function EditCategoryDialog({
  categoryId,
  open,
  onClose,
}: EditCategoryDialogProps) {
  const { categories, updateCategory } = useProductStore();
  const category = categories.find((c) => c.id === categoryId);

  const [label, setLabel] = useState(category?.label || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) setLabel(category.label);
  }, [category]);

  const handleSubmit = async () => {
    if (!category) return;
    setLoading(true);
    try {
      await updateCategory({ id: category.id, label }, file || undefined);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {category.image_url && (
            <img
              src={category.image_url}
              className="w-24 h-24 object-cover mt-2"
            />
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
