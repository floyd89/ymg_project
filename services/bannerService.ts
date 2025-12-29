
import { Banner } from '../types';
import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'store-images';

const ensureFullUrl = (pathOrUrl: string | null | undefined): string => {
    // Kembalikan placeholder jika input tidak valid, karena tipe Banner mengharuskan string.
    if (!pathOrUrl) return 'https://via.placeholder.com/1200x600'; 
    // Jika sudah URL lengkap, kembalikan apa adanya.
    if (pathOrUrl.startsWith('http')) {
        return pathOrUrl;
    }
    // Jika ini adalah nama file (path), bangun URL lengkapnya.
    const supabaseUrlString = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrlString) {
        console.error("VITE_SUPABASE_URL tidak ditemukan, tidak dapat membangun URL gambar lengkap.");
        return pathOrUrl;
    }
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.substring(1) : pathOrUrl;
    return `${supabaseUrlString}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
}

const getBanners = async (): Promise<Banner[]> => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching banners:", error);
        throw new Error(`Tidak dapat mengambil data banner: ${error.message}`);
    }
    
    // Map data dan pastikan semua imgUrl adalah URL yang lengkap dan valid.
    return (data || []).map(banner => ({
        ...banner,
        imgUrl: ensureFullUrl(banner.imgUrl),
    }));
};
  
const saveBanners = async (banners: Banner[]): Promise<void> => {
    // Hapus 'created_at' dari setiap item banner sebelum upsert
    const upsertData = banners.map(b => {
      const { created_at, ...rest } = b as any;
      return rest;
    });

    const { error } = await supabase
      .from('banners')
      .upsert(upsertData, { onConflict: 'id' });

    if (error) {
        console.error("Error saving banners:", error);
        throw new Error(`Gagal menyimpan banner: ${error.message}`);
    }
};

export const bannerService = {
  getBanners,
  saveBanners,
};