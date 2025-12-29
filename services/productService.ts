
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

  // Ambil hostname yang benar dari URL Supabase yang ada di pengaturan
  const supabaseUrlString = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrlString) {
      console.error("VITE_SUPABASE_URL tidak ditemukan. URL gambar mungkin tidak dapat dikoreksi.");
      // Jika URL Supabase tidak ada, kembalikan data apa adanya setelah sanitasi dasar
      return (data || []).map(p => ({
        ...p,
        variants: p.variants || [],
        highlights: p.highlights || [],
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : (p.imageUrls ? [p.imageUrls] : []),
      }));
  }
  const correctHostname = new URL(supabaseUrlString).hostname;

  // Supabase mungkin mengembalikan null jika tabel kosong
  return (data || []).map(p => {
    // 1. Sanitasi dasar untuk memastikan imageUrls selalu berupa array
    const sanitizedImageUrls = (value: any): string[] => {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === 'string' && value.startsWith('http')) {
        return [value]; // Ubah string URL tunggal menjadi array
      }
      return []; // Default ke array kosong jika format tidak dikenal
    };

    const initialUrls = sanitizedImageUrls(p.imageUrls);

    // 2. Koreksi hostname pada setiap URL jika tidak cocok
    const correctedUrls = initialUrls.map(url => {
        if (!url || !url.startsWith('http')) {
            return ''; // Abaikan URL yang tidak valid
        }
        try {
            const imageUrlObject = new URL(url);
            // Bandingkan hostname dan ganti jika berbeda
            if (imageUrlObject.hostname !== correctHostname) {
                imageUrlObject.hostname = correctHostname;
                return imageUrlObject.toString();
            }
            return url; // URL sudah benar
        } catch (e) {
            console.warn(`URL gambar tidak valid terdeteksi untuk produk ${p.id}: ${url}`);
            return '';
        }
    }).filter(Boolean); // Hapus string kosong dari hasil akhir

    return {
      ...p,
      variants: p.variants || [],
      highlights: p.highlights || [],
      imageUrls: correctedUrls, // Gunakan URL yang sudah dikoreksi
    };
  });
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
