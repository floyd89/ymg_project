
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
  const BUCKET_NAME = 'store-images';

  return (data || []).map(p => {
    // 1. Sanitasi dasar untuk memastikan imageUrls selalu berupa array
    const sanitizedImageUrls = (value: any): string[] => {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === 'string') {
        // Ini bisa berupa URL tunggal atau nama file tunggal
        return [value]; 
      }
      return []; // Default ke array kosong jika format tidak dikenal
    };

    const initialUrls = sanitizedImageUrls(p.imageUrls);

    // 2. Koreksi atau bangun URL yang lengkap untuk setiap item
    const finalUrls = initialUrls.map(url => {
        if (!url) return ''; // Abaikan nilai null atau kosong

        // Cek apakah ini URL lengkap atau hanya path/nama file
        if (url.startsWith('http')) {
            // Ini adalah URL lengkap, lakukan koreksi hostname jika perlu
            try {
                const imageUrlObject = new URL(url);
                if (imageUrlObject.hostname !== correctHostname) {
                    imageUrlObject.hostname = correctHostname;
                    return imageUrlObject.toString();
                }
                return url; // URL sudah benar
            } catch (e) {
                console.warn(`URL gambar lengkap tidak valid: ${url}`);
                return ''; // Abaikan jika format URL-nya rusak
            }
        } else {
            // Ini kemungkinan besar adalah nama file. Bangun URL lengkap.
            // Pastikan tidak ada garis miring di awal path agar URL tidak rusak
            const cleanPath = url.startsWith('/') ? url.substring(1) : url;
            return `${supabaseUrlString}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
        }
    }).filter(Boolean); // Hapus string kosong dari hasil akhir

    return {
      ...p,
      variants: p.variants || [],
      highlights: p.highlights || [],
      imageUrls: finalUrls, // Gunakan URL yang sudah final
    };
  });
};

const saveProduct = async (productToSave: Product): Promise<Product> => {
  // Hapus properti 'created_at' jika ada, karena ini diatur oleh database
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
