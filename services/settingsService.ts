
import { AppSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

const SETTINGS_ID = 1;

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

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*') // Ambil semua kolom
      .eq('id', SETTINGS_ID)
      .limit(1);

    if (error) {
      console.error("Error fetching settings:", error);
      return defaultSettings; // Kembalikan default jika gagal
    }

    // Jika data ada, gabungkan dengan default untuk mengisi nilai yang mungkin null
    if (data && data.length > 0) {
      return { ...defaultSettings, ...data[0] };
    }

    // Jika tidak ada baris data, kembalikan default
    return defaultSettings;
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    // Ambil semua properti dari objek settings, kecuali yang tidak ingin kita simpan
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
