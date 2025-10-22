import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "../../../../stores/useProductStore";
import Searchbar from "@/components/shared/searchbar";
import { Button } from "@/components/ui/button";
import AddProductDialog from "./add";
import AddCategoryDialog from "./category/add";
import CategoryTable from "@/pages/admin/products/category-table";
import ProductTable from "@/pages/admin/products/product-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function ProductPage() {
  const { fetchProducts, fetchCategories, categories } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [tab, setTab] = useState<"products" | "categories">("products");

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Prepare category options for filtering
  const categoryOptions = useMemo(
    () => [{ id: "all", label: "All Categories" }, ...categories],
    [categories]
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Product Management
        </h2>

        {tab === "products" && (
          <Button onClick={() => setAddProductOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        )}

        {tab === "categories" && (
          <Button onClick={() => setAddCategoryOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={(value: string) =>
          setTab(value as "products" | "categories")
        }
        className="w-full"
      >
        <div className="w-full  flex flex-col gap-4">
          <TabsList className="w-fit">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {tab === "products" && (
            <div className="w-1/2 flex gap-4 place-self-end justify-end">
              <Searchbar value={searchTerm} onChange={setSearchTerm} />

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4">
          <TabsContent value="products">
            <ProductTable
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryTable />
          </TabsContent>
        </div>
      </Tabs>

      {/* Add Product Dialog */}
      {addProductOpen && (
        <AddProductDialog
          open={addProductOpen}
          onClose={() => setAddProductOpen(false)}
        />
      )}

      {/* Add Category Dialog */}
      {addCategoryOpen && (
        <AddCategoryDialog
          open={addCategoryOpen}
          onClose={() => setAddCategoryOpen(false)}
        />
      )}
    </section>
  );
}
