import { useState } from "react";
import { useProductStore } from "../../../../stores/useProductStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { MoreHorizontal, Trash2, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import EditCategoryDialog from "./category/edit";
import DeleteCategoryDialog from "./category/delete";

export default function CategoryTable() {
  const { categories, loading } = useProductStore();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  return (
    <div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.label}</TableCell>
                  <TableCell>
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedCategoryId(c.id);
                              setEditOpen(true);
                            }}
                          >
                            <SquarePen className="w-4 h-4 mr-2" /> Edit
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedCategoryId(c.id);
                              setDeleteOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-600" />{" "}
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editOpen && selectedCategoryId && (
        <EditCategoryDialog
          categoryId={selectedCategoryId}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
      {deleteOpen && selectedCategoryId && (
        <DeleteCategoryDialog
          categoryId={selectedCategoryId}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
