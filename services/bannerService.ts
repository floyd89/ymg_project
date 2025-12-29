
import { Banner } from '../types';

const BANNERS_KEY = 'ymg_banners';

const initialBanners: Banner[] = [
  {
    id: 'banner-1',
    imgUrl: "https://picsum.photos/seed/fashion-lifestyle/1200/500",
    title: "Koleksi Tas Terbaru",
    subtitle: "Temukan gayamu, bawa ceritamu."
  },
  {
    id: 'banner-2',
    imgUrl: "https://picsum.photos/seed/urban-adventure/1200/500",
    title: "Siap Untuk Petualangan Kota",
    subtitle: "Ransel fungsional dengan sentuhan modern."
  },
  {
    id: 'banner-3',
    imgUrl: "https://picsum.photos/seed/elegant-style/1200/500",
    title: "Elegan di Setiap Momen",
    subtitle: "Tas jinjing premium untuk tampilan profesional."
  }
];

export const bannerService = {
  getBanners: (): Banner[] => {
    try {
      const storedBanners = localStorage.getItem(BANNERS_KEY);
      if (storedBanners) {
        return JSON.parse(storedBanners);
      } else {
        localStorage.setItem(BANNERS_KEY, JSON.stringify(initialBanners));
        return initialBanners;
      }
    } catch (error) {
      console.error("Gagal memuat banner:", error);
      return initialBanners;
    }
  },
  
  saveBanners: (banners: Banner[]): void => {
    try {
      localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
    } catch (error) {
      console.error("Gagal menyimpan banner:", error);
    }
  }
};
