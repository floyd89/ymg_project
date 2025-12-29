
export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string; // e.g., '#333333'
  price?: string; // Harga spesifik untuk varian, opsional
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  fullDescription: string;
  highlights: string[];
  imageUrls: string[]; // Menggantikan imageUrl tunggal
  variants: ProductVariant[];
}

export interface Banner {
  id: string;
  imgUrl: string;
  title: string;
  subtitle: string;
}

export interface AppSettings {
  whatsAppNumber: string;
  storeName?: string | null;
  storeTagline?: string | null;
  storeLogoUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
}

export type View = 'home' | 'detail' | 'about';
