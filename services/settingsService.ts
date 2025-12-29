import { AppSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

const SETTINGS_ID = 1;

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('whatsAppNumber')
      .eq('id', SETTINGS_ID)
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
      return { whatsAppNumber: '' }; // Kembalikan default jika gagal
    }

    return data || { whatsAppNumber: '' };
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    const { error } = await supabase
      .from('settings')
      .update({ whatsAppNumber: settings.whatsAppNumber })
      .eq('id', SETTINGS_ID);

    if (error) {
      console.error("Error saving settings:", error);
      throw new Error('Gagal menyimpan pengaturan');
    }
  },
};
