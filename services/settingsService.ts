
import { AppSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

const SETTINGS_ID = 1;
const BUCKET_NAME = 'store-images';

// Objek default yang lengkap untuk memastikan tidak ada nilai 'undefined'
const defaultSettings: AppSettings = {
  whatsAppNumber: '',
  storeName: 'YMG Official Store',
  storeTagline: 'Fashion & Accessories',
  storeLogoUrl: 'https://picsum.photos/seed/ymg-store/600/600',
  instagramUrl: '',
  tiktokUrl: '',
  facebookUrl: '',
  telegramUrl: '',
};

const ensureFullUrl = (pathOrUrl: string | null | undefined): string | null => {
    // Jika URL sudah lengkap (dimulai dengan http) atau tidak ada, kembalikan apa adanya.
    if (!pathOrUrl || pathOrUrl.startsWith('http')) {
        return pathOrUrl || null;
    }

    // Jika ini adalah nama file (path), bangun URL lengkapnya.
    const supabaseUrlString = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrlString) {
        console.error("VITE_SUPABASE_URL tidak ditemukan, tidak dapat membangun URL gambar lengkap.");
        return pathOrUrl; // Kembalikan path jika URL Supabase tidak tersedia
    }
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.substring(1) : pathOrUrl;
    return `${supabaseUrlString}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
}

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .limit(1);

    if (error) {
      console.error("Error fetching settings:", error);
      return defaultSettings;
    }

    if (data && data.length > 0) {
      const dbSettings = data[0];
      // Pastikan URL logo adalah URL lengkap sebelum digabungkan dengan default
      dbSettings.storeLogoUrl = ensureFullUrl(dbSettings.storeLogoUrl);
      return { ...defaultSettings, ...dbSettings };
    }

    return defaultSettings;
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    const { ...settingsToSave } = settings;

    const { error } = await supabase
      .from('settings')
      .upsert({ id: SETTINGS_ID, ...settingsToSave });

    if (error) {
      console.error("Error saving settings:", error);
      throw new Error(`Gagal menyimpan pengaturan: ${error.message}`);
    }
  },
};