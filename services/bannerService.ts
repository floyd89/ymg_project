import { Banner } from '../types';
import { supabase } from '../lib/supabaseClient';

const getBanners = async (): Promise<Banner[]> => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching banners:", error);
        throw new Error(`Tidak dapat mengambil data banner: ${error.message}`);
    }
    return data || [];
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