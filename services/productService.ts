
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
      return (data || []).map(p => ({
        ...p,
        variants: p.variants || [],
        highlights: p.highlights || [],
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
        isActive: p.isActive === null || p.isActive === undefined ? true : p.isActive,
        category: Array.isArray(p.category) ? p.category : [],
        size: p.size || '',
        availableSizes: p.availableSizes || [],
      }));
  }
  const BUCKET_NAME = 'store-images';

  const buildFullUrl = (url: string | null | undefined): string => {
      if (!url) return '';
      if (url.startsWith('http')) {
          try {
              const imageUrlObject = new URL(url);
              // Opsi: Anda bisa menambahkan validasi hostname di sini jika perlu
              return url;
          } catch (e) {
              console.warn(`URL gambar tidak valid: ${url}`);
              return '';
          }
      } else {
          const cleanPath = url.startsWith('/') ? url.substring(1) : url;
          return `${supabaseUrlString}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
      }
  };

  return (data || []).map(p => {
    const sanitizedImageUrls = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value]; 
      return [];
    };
    
    const finalUrls = sanitizedImageUrls(p.imageUrls).map(buildFullUrl).filter(Boolean);

    const getCategoriesArray = (category: any): string[] => {
        if (!category) {
            return [];
        }
        if (Array.isArray(category)) {
            // Secara rekursif mem-parsing setiap item dan meratakannya menjadi satu array
            return category.flatMap(item => getCategoriesArray(item));
        }
        if (typeof category === 'string') {
            try {
                // Coba parsing sebagai JSON terlebih dahulu, ini akan menangani "[\"Slingbag\"]"
                const parsed = JSON.parse(category);
                return getCategoriesArray(parsed);
            } catch (e) {
                // Jika gagal, anggap sebagai string biasa atau format array postgres
                let str = category.trim();
                if (str.startsWith('{') && str.endsWith('}')) {
                    str = str.substring(1, str.length - 1);
                }
                return str.split(',').map(c => c.trim().replace(/"/g, '')).filter(Boolean);
            }
        }
        return [];
    };

    const processedVariants = (p.variants || []).map((v: any) => ({
      ...v,
      imageUrl: buildFullUrl(v.imageUrl),
    }));

    return {
      ...p,
      category: getCategoriesArray(p.category),
      variants: processedVariants,
      highlights: p.highlights || [],
      imageUrls: finalUrls,
      size: p.size || '',
      availableSizes: p.availableSizes || [],
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
  // 1. Ambil data produk untuk mendapatkan path gambar
  const { data: productData, error: fetchError } = await supabase
    .from('products')
    .select('imageUrls, variants')
    .eq('id', productId)
    .single();

  // Jika produk tidak ditemukan (misalnya sudah dihapus), hentikan proses tanpa error.
  if (fetchError && fetchError.code === 'PGRST116') {
    console.warn(`Produk dengan ID ${productId} tidak ditemukan, mungkin sudah dihapus.`);
    return;
  }
  
  if (fetchError) {
    console.error("Error fetching product for deletion:", fetchError);
    throw new Error(`Gagal mengambil data produk untuk dihapus: ${fetchError.message}`);
  }

  // 2. Kumpulkan semua path gambar yang terkait dengan produk
  const imagePathsToDelete: string[] = [];
  if (productData?.imageUrls && Array.isArray(productData.imageUrls)) {
    imagePathsToDelete.push(...productData.imageUrls.filter(p => p));
  }
  if (productData?.variants && Array.isArray(productData.variants)) {
    productData.variants.forEach((variant: any) => {
      if (variant.imageUrl) {
        imagePathsToDelete.push(variant.imageUrl);
      }
    });
  }

  // 3. Hapus gambar dari Supabase Storage jika ada
  if (imagePathsToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('store-images')
      .remove(imagePathsToDelete);
    
    if (storageError) {
      // Catat error tapi jangan hentikan proses.
      // Lebih baik menghapus record database daripada meninggalkan produk "zombie".
      console.error(`Gagal menghapus beberapa gambar dari storage untuk produk ${productId}. Lanjutkan menghapus record database.`, storageError);
    }
  }

  // 4. Hapus record produk dari database
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  
  if (deleteError) {
    console.error("Error deleting product record:", deleteError);
    throw new Error(`Gagal menghapus produk: ${deleteError.message}`);
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