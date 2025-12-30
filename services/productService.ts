
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
      console.error("VITE_SUPABASE_URL tidak ditemukan.");
      // Jika URL Supabase tidak ada, kembalikan data apa adanya setelah sanitasi dasar
      return (data || []).map(p => ({
        ...p,
        variants: p.variants || [],
        highlights: p.highlights || [],
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
        isActive: p.isActive === null || p.isActive === undefined ? true : p.isActive,
        category: Array.isArray(p.category) ? p.category : [],
      }));
  }
  const correctHostname = new URL(supabaseUrlString).hostname;
  const BUCKET_NAME = 'store-images';

  return (data || []).map(p => {
    const sanitizedImageUrls = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value]; 
      return [];
    };

    const initialUrls = sanitizedImageUrls(p.imageUrls);

    const finalUrls = initialUrls.map(url => {
        if (!url) return '';
        if (url.startsWith('http')) {
            try {
                const imageUrlObject = new URL(url);
                if (imageUrlObject.hostname !== correctHostname) {
                    imageUrlObject.hostname = correctHostname;
                    return imageUrlObject.toString();
                }
                return url;
            } catch (e) {
                console.warn(`URL gambar tidak valid: ${url}`);
                return '';
            }
        } else {
            const cleanPath = url.startsWith('/') ? url.substring(1) : url;
            return `${supabaseUrlString}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
        }
    }).filter(Boolean); 

    const getCategoriesArray = (category: any): string[] => {
        if (Array.isArray(category)) {
            return category;
        }
        if (typeof category === 'string' && category.length > 0) {
            // Ini menangani kasus jika kolom DB masih berupa `text`
            return [category];
        }
        return [];
    }

    return {
      ...p,
      category: getCategoriesArray(p.category),
      variants: p.variants || [],
      highlights: p.highlights || [],
      imageUrls: finalUrls,
      isActive: p.isActive === null || p.isActive === undefined ? true : p.isActive,
    };
  });
};

const saveProduct = async (productToSave: Product): Promise<Product> => {
  const { created_at, ...upsertData } = productToSave as any;

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

const updateProductStatus = async (productId: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ isActive: isActive })
    .eq('id', productId);
  
  if (error) {
    console.error("Error updating product status:", error);
    throw new Error(`Gagal memperbarui status produk: ${error.message}`);
  }
};

export const productService = {
  getProducts,
  saveProduct,
  deleteProduct,
  updateProductStatus,
};
