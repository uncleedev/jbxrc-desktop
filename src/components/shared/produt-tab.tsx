import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "../../../stores/useProductStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoryTable from "@/pages/admin/products/category-table";
import ProductTable from "@/pages/admin/products/product-table";

export default function ProductPageTabs() {
  const { fetchProducts, fetchCategories, categories } = useProductStore();

  const [tab, setTab] = useState<"products" | "categories">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Prepare category options for filtering
  const categoryOptions = useMemo(
    () => [{ id: "all", label: "All Categories" }, ...categories],
    [categories]
  );

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Product Management</h2>

      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={(value: string) =>
          setTab(value as "products" | "categories")
        }
      >
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label htmlFor="categoryFilter">Category</Label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded-md p-2 text-sm"
              >
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Table */}
          <ProductTable
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
          />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="mt-4">
          <CategoryTable />
        </TabsContent>
      </Tabs>
    </section>
  );
}
