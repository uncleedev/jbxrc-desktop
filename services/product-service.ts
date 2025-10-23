import { supabase } from "../src/lib/supabase";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductCategory,
  ProductCategoryCreate,
  ProductCategoryUpdate,
} from "@/types/product";

async function uploadImage(
  file: File,
  folder = "products"
): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(folder)
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: publicUrl } = await supabase.storage
    .from(folder)
    .getPublicUrl(filePath);

  return { url: publicUrl.publicUrl, path: filePath };
}

async function deleteImage(path: string, folder = "products") {
  if (!path) return;
  const { error } = await supabase.storage.from(folder).remove([path]);
  if (error) console.warn("Failed to delete image:", error.message);
}

export const productService = {
  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    return data || [];
  },

  createProduct: async (
    product: ProductCreate,
    file?: File
  ): Promise<Product> => {
    let imageData = {};
    if (file) {
      const { url, path } = await uploadImage(file);
      imageData = { image_url: url, image_path: path };
    }

    const { data, error } = await supabase
      .from("products")
      .insert({ ...product, ...imageData })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateProduct: async (
    product: ProductUpdate,
    file?: File
  ): Promise<Product> => {
    const { id, image_path: oldPath, ...rest } = product;
    let imageData = {};

    if (file) {
      // Delete old image if exists
      if (oldPath) await deleteImage(oldPath, "products");
      // Upload new one
      const { url, path } = await uploadImage(file);
      imageData = { image_url: url, image_path: path };
    }

    const { data, error } = await supabase
      .from("products")
      .update({ ...rest, ...imageData })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    // Fetch image_path before deleting
    const { data: product } = await supabase
      .from("products")
      .select("image_path")
      .eq("id", id)
      .single();

    if (product?.image_path) await deleteImage(product.image_path, "products");

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Categories ---
  getCategories: async (): Promise<ProductCategory[]> => {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*");
    if (error) throw error;
    return data || [];
  },

  createCategory: async (
    category: ProductCategoryCreate,
    file?: File
  ): Promise<ProductCategory> => {
    let imageData = {};
    if (file) {
      const { url, path } = await uploadImage(file, "categories");
      imageData = { image_url: url, image_path: path };
    }

    const { data, error } = await supabase
      .from("product_categories")
      .insert({ ...category, ...imageData })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateCategory: async (
    category: ProductCategoryUpdate,
    file?: File
  ): Promise<ProductCategory> => {
    const { id, image_path: oldPath, ...rest } = category;
    let imageData = {};

    if (file) {
      if (oldPath) await deleteImage(oldPath, "categories");
      const { url, path } = await uploadImage(file, "categories");
      imageData = { image_url: url, image_path: path };
    }

    const { data, error } = await supabase
      .from("product_categories")
      .update({ ...rest, ...imageData })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { data: category } = await supabase
      .from("product_categories")
      .select("image_path")
      .eq("id", id)
      .single();

    if (category?.image_path)
      await deleteImage(category.image_path, "categories");

    const { error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
