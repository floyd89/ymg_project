
import { AppSettings } from '../types';

const SETTINGS_KEY = 'ymg_app_settings';

const initialSettings: AppSettings = {
  whatsAppNumber: '6281234567890', // Default number
};

export const settingsService = {
  getSettings: (): AppSettings => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        return JSON.parse(storedSettings);
      } else {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(initialSettings));
        return initialSettings;
      }
    } catch (error) {
      console.error("Gagal memuat pengaturan:", error);
      return initialSettings;
    }
  },

  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Gagal menyimpan pengaturan:", error);
    }
  },
};
