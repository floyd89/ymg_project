
import { AppSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

const SETTINGS_ID = 1;
const BUCKET_NAME = 'store-images';

// Objek default yang lengkap untuk memastikan tidak ada nilai 'undefined'
const defaultSettings: AppSettings = {
  whatsAppNumber: '',
  storeName: 'YMG',
  storeTagline: 'Explore your true style',
  storeLogoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARAAAAG9AQAAAABv75sCAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfoBhwUKy7dGPukAAAEwUlEQVR42u3dMW7bRhBA4XN3EiABUqRgtqAb4BOwZg0SJMkSvUf0Dm3aJEhCq23TJEgC7UGbNEnQJHYJCgQpEoERQILcUeQ4cR9fL56/3HvvjwxtbN0/AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgT/P06QcYN04efvH09QsA4Ld59eErGPfPnn746sMXAIBf4tWHL2DcPH341YcvAIC/yav3XsC4ef7w6r0XAIB/k9fvvYBx8+Lh17/3AgD4z/L10xfY3b1698Gr914AAH6Z1x++gHGz5cM38xYAwPZ59eELEB5/u//h6/deAAAAeD6vPnwhwOMP33uBAAA4y6sPXwjx+MM3AACALvLqAxfY3d1798Grd18AAM6y+sCF/R+A/zBvAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDg+fl56+YLAODpefr0A4wbJ4+/ePr6BQDw2zx7+AVG/bOnefjqwxkA4Jd49uAbGDenPnzt4YwDAPwlXn34AsbNkwffPHgGAfgtef0BGDePHnzr4RkA4Lfk9Qdg3Lx48NUPZwCA35LXH4BxswffevgGAHAHef0BGDe33/3wzVsAAN7L6w/AuHnz4FUPZwCAe8jrD8C4efrgVQ9nAID7yOsPwLh58OC3H84AAG9h1Qcg/Pnwaoaz/wG8jVUPgPAnD1/DeAMAeBOrHhDhTx6+hvEGAPAWVz0gwp89fA3jDQBgb646IMKfPnwd4w0AYG+uesC4+ZOHr2G8AQDsiVYPuOnDlw/AegMA2BOrHnDTp29g/QEAtidWH3Dz5OHrGO8AALYjVh9w07evYbwBALA1WH1ATZ++hvEGANCmrD5Q08evYbwBAHQTqw/U9OEbGMcB0E2sPqAmD9/AOAeAbsrqAzV9+AbGOQBsTaw+UJP7r2P8BsBeYvUBNbn/OsZvAGwtVh9Qk/uvY/wGsL2f+3+7+3f3v0t/B2DvWlT1gZvc/x3jN4D9f+z+T/d/ev8H8B5WNQDys/vfY/wG8H5WNYC8/vbXMb4F8G5WNYC8/u7XMb4F8G5XNQDys/tfY/wGsI9VDZCfrX8d4zeAfazqgPx8/esYvwHsr6oD8rP/X8f4DeD/r+oA/C/y1gMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA/25/11/n74aA4wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNy0yOFQyMDo0Mzo0NSswMDowMCL/a3EAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDctMjhUMjA6NDM6NDUrMDA6MDCz4rFFAAAAAElFTkSuQmCC',
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