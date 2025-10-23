import { useState, useMemo } from "react";
import { useProductStore } from "../../../../stores/useProductStore";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductUpdate } from "@/types/product";
import EditProductDialog from "./edit";
import DeleteProductDialog from "./delete";

interface ProductTableProps {
  searchTerm: string;
  categoryFilter: string;
}

export default function ProductTable({
  searchTerm,
  categoryFilter,
}: ProductTableProps) {
  const { products, categories, loading } = useProductStore();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  // Efficient category lookup
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, c) => {
      acc[c.id] = c.label;
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  return (
    <div className="rounded-md border w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead> {/* 🖼️ Added Image Column */}
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>MC</TableHead>
            <TableHead>CC</TableHead>
            <TableHead>MP</TableHead>
            <TableHead>SP</TableHead>
            <TableHead>PT</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                Loading products...
              </TableCell>
            </TableRow>
          ) : filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((p) => (
              <TableRow key={p.id}>
                {/* 🖼️ Image Cell */}
                <TableCell>
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md border text-xs">
                      No Image
                    </div>
                  )}
                </TableCell>

                <TableCell>{p.name}</TableCell>
                <TableCell>
                  {p.category ? categoryMap[p.category] ?? "-" : "-"}
                </TableCell>

                <TableCell>{p.mc || "-"}</TableCell>
                <TableCell>{p.cc || "-"}</TableCell>
                <TableCell>{p.mp}</TableCell>
                <TableCell>{p.sp}</TableCell>
                <TableCell>{p.pt}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedProductId(p.id);
                          setEditOpen(true);
                        }}
                      >
                        <SquarePen className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedProductId(p.id);
                          setDeleteOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      {editOpen && selectedProductId && (
        <EditProductDialog
          product={
            (() => {
              const product = products.find((p) => p.id === selectedProductId);
              if (!product) return null;
              const productUpdate: ProductUpdate = {
                id: product.id,
                name: product.name,
                category: product.category ?? undefined,
                mp: product.mp,
                sp: product.sp,
                pt: product.pt,
                mc: product.mc ?? undefined,
                cc: product.cc ?? undefined,
                image_url: product.image_url ?? undefined,
                image_path: product.image_path ?? undefined,
              };
              return productUpdate;
            })()!
          }
          categories={categories}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Delete Dialog */}
      {deleteOpen && selectedProductId && (
        <DeleteProductDialog
          productId={selectedProductId}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
