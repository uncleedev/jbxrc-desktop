import { create } from "zustand";
import { toast } from "sonner";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductCategory,
  ProductCategoryCreate,
  ProductCategoryUpdate,
} from "../types/product";
import { productService } from "../services/product-service";

type ProductState = {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;

  // Product actions
  fetchProducts: () => Promise<void>;
  addProduct: (data: ProductCreate, file?: File) => Promise<void>;
  updateProduct: (data: ProductUpdate, file?: File) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Category actions
  fetchCategories: () => Promise<void>;
  addCategory: (data: ProductCategoryCreate, file?: File) => Promise<void>;
  updateCategory: (data: ProductCategoryUpdate, file?: File) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,

  // --- Products ---
  fetchProducts: async () => {
    try {
      set({ loading: true });
      const products = await productService.getProducts();
      set({ products, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      toast.error(`Failed to fetch products: ${err.message}`);
    }
  },

  addProduct: async (data: ProductCreate, file?: File) => {
    try {
      const product = await productService.createProduct(data, file);
      set((state) => ({ products: [product, ...state.products] }));
      toast.success("Product added successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to add product: ${err.message}`);
    }
  },

  updateProduct: async (data: ProductUpdate, file?: File) => {
    try {
      const updated = await productService.updateProduct(data, file);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === updated.id ? updated : p
        ),
      }));
      toast.success("Product updated successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to update product: ${err.message}`);
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      toast.success("Product deleted successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to delete product: ${err.message}`);
    }
  },

  // --- Categories ---
  fetchCategories: async () => {
    try {
      set({ loading: true });
      const categories = await productService.getCategories();
      set({ categories, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      toast.error(`Failed to fetch categories: ${err.message}`);
    }
  },

  // 🔹 Fix: accept optional file for image upload
  addCategory: async (data: ProductCategoryCreate, file?: File) => {
    try {
      const category = await productService.createCategory(data, file);
      set((state) => ({ categories: [category, ...state.categories] }));
      toast.success("Category added successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to add category: ${err.message}`);
    }
  },

  updateCategory: async (data: ProductCategoryUpdate, file?: File) => {
    try {
      const updated = await productService.updateCategory(data, file);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === updated.id ? updated : c
        ),
      }));
      toast.success("Category updated successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to update category: ${err.message}`);
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await productService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      toast.success("Category deleted successfully!");
    } catch (err: any) {
      set({ error: err.message });
      toast.error(`Failed to delete category: ${err.message}`);
    }
  },
}));
