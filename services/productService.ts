
import { Product } from '../types';
import { supabase } from '../lib/supabaseClient';

const getProducts = async (): Promise<Product[]> => {
  // Upaya pertama: kueri dengan pengurutan 'position'
  let { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1000)
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  // Cek apakah error spesifik karena kolom 'position' tidak ada
  if (error && (error.message.includes('column "position" does not exist') || error.message.includes("column products.position does not exist"))) {
    console.warn("Retrying getProducts without 'position' ordering. The 'position' column seems to be missing.");
    
    // Upaya kedua: coba lagi kueri tanpa pengurutan 'position'
    const retryResult = await supabase
      .from('products')
      .select('*')
      .limit(1000)
      .order('created_at', { ascending: false });
      
    data = retryResult.data;
    error = retryResult.error;
  }

  // Tangani error lain (atau error dari upaya kedua)
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
        sizes: p.sizes || [],
      }));
  }
  const BUCKET_NAME = 'store-images';

  const buildFullUrl = (url: string | null | undefined): string => {
      if (!url) return '';
      if (url.startsWith('http')) {
          try {
              const imageUrlObject = new URL(url);
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
            return category.flatMap(item => getCategoriesArray(item));
        }
        if (typeof category === 'string') {
            try {
                const parsed = JSON.parse(category);
                return getCategoriesArray(parsed);
            } catch (e) {
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
      isAvailable: v.isAvailable === false ? false : true,
    }));
    
    const processedSizes = (p.sizes || []).map((s: any) => ({
        ...s,
        isAvailable: s.isAvailable === false ? false : true,
    }));

    return {
      ...p,
      category: getCategoriesArray(p.category),
      variants: processedVariants,
      sizes: processedSizes,
      highlights: p.highlights || [],
      imageUrls: finalUrls,
      isActive: p.isActive === null || p.isActive === undefined ? true : p.isActive,
      position: p.position,
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
  const { data: productData, error: fetchError } = await supabase
    .from('products')
    .select('imageUrls, variants')
    .eq('id', productId)
    .single();

  if (fetchError && fetchError.code === 'PGRST116') {
    console.warn(`Produk dengan ID ${productId} tidak ditemukan, mungkin sudah dihapus.`);
    return;
  }
  
  if (fetchError) {
    console.error("Error fetching product for deletion:", fetchError);
    throw new Error(`Gagal mengambil data produk untuk dihapus: ${fetchError.message}`);
  }

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

  if (imagePathsToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('store-images')
      .remove(imagePathsToDelete);
    
    if (storageError) {
      console.error(`Gagal menghapus beberapa gambar dari storage untuk produk ${productId}. Lanjutkan menghapus record database.`, storageError);
    }
  }

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

const updateProductOrder = async (orderedProducts: {id: string, position: number}[]): Promise<void> => {
    // Menggunakan serangkaian operasi 'update' individual yang dijalankan secara paralel.
    // Ini lebih aman daripada 'upsert' dengan data parsial karena secara eksplisit
    // hanya memperbarui kolom 'position' dan tidak akan mencoba menyisipkan baris baru,
    // sehingga menghindari error 'NOT NULL constraint' jika ada ketidaksesuaian ID.
    const updatePromises = orderedProducts.map(p =>
        supabase
            .from('products')
            .update({ position: p.position })
            .eq('id', p.id)
    );

    const results = await Promise.all(updatePromises);
    const firstErrorResult = results.find(result => result.error);

    if (firstErrorResult) {
        console.error("Error updating product order:", firstErrorResult.error);
        throw new Error(`Gagal menyimpan urutan produk: ${firstErrorResult.error!.message}`);
    }
}

export const productService = {
  getProducts,
  saveProduct,
  deleteProduct,
  updateProductStatus,
  updateProductOrder
};