import { AppSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

const SETTINGS_ID = 1;

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    // FIX: Hapus .single() untuk mencegah galat jika baris pengaturan belum ada.
    // Sebaliknya, kita ambil data dan periksa apakah ada hasilnya.
    const { data, error } = await supabase
      .from('settings')
      .select('whatsAppNumber')
      .eq('id', SETTINGS_ID)
      .limit(1); // Praktik yang baik untuk membatasi ke 1 baris.

    if (error) {
      console.error("Error fetching settings:", error);
      return { whatsAppNumber: '' }; // Kembalikan default jika gagal
    }

    // Jika data ada dan memiliki baris, kembalikan. Jika tidak, kembalikan default.
    return (data && data.length > 0) ? data[0] : { whatsAppNumber: '' };
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    // FIX: Gunakan upsert alih-alih update. Ini akan membuat baris pengaturan
    // dengan id=1 jika belum ada, dan memperbaruinya jika sudah ada.
    // Ini membuat sistem dapat memperbaiki dirinya sendiri.
    const { error } = await supabase
      .from('settings')
      .upsert({ id: SETTINGS_ID, whatsAppNumber: settings.whatsAppNumber });

    if (error) {
      console.error("Error saving settings:", error);
      throw new Error(`Gagal menyimpan pengaturan: ${error.message}`);
    }
  },
};