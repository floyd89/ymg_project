
import { Product } from '../types';
import { supabase } from '../lib/supabaseClient';

const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Tidak dapat mengambil data produk: ${error.message}`);
  }
  // Supabase mungkin mengembalikan null jika tabel kosong
  return (data || []).map(p => ({
    ...p,
    variants: p.variants || [],
    highlights: p.highlights || [],
    imageUrls: p.imageUrls || [], // Memastikan imageUrls selalu array
  }));
};

const saveProduct = async (productToSave: Product): Promise<Product> => {
  // Hapus properti 'created_at' jika ada, karena ini diatur oleh database
  // FIX: Cast productToSave to a type that includes the optional `created_at` property, which Supabase adds but is not in our `Product` type. This prevents a TypeScript error.
  const { created_at, ...upsertData } = productToSave as Product & { created_at?: string };

  if (upsertData.id.startsWith('new-product-')) {
    upsertData.id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  
  const { data, error } = await supabase
    .from('products')
    .upsert(upsertData, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error("Error saving product:", error);
    throw new Error(`Gagal menyimpan produk: ${error.message}`);
  }

  return data;
};

const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  
  if (error) {
    console.error("Error deleting product:", error);
    throw new Error(`Gagal menghapus produk: ${error.message}`);
  }
};

export const productService = {
  getProducts,
  saveProduct,
  deleteProduct,
};
