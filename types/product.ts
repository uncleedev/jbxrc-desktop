export type ProductCategory = {
  id: string;
  label: string;
  image_url?: string | null;
  image_path?: string | null;
  created_at: string;
};

export type ProductCategoryCreate = Omit<ProductCategory, "id" | "created_at">;
export type ProductCategoryUpdate = Partial<
  Omit<ProductCategory, "id" | "created_at">
> & { id: string };

export type Product = {
  id: string;
  name: string;
  image_url?: string | null;
  image_path?: string | null;
  mc?: string | null;
  cc?: string | null;
  mp: number;
  sp: number;
  pt: number;
  category?: string | null;
  created_at: string;
};

export type ProductCreate = Omit<Product, "id" | "created_at">;
export type ProductUpdate = Partial<Omit<Product, "id" | "created_at">> & {
  id: string;
};
