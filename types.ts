
export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string; // e.g., '#333333'
  imageUrl: string;
  price?: string; // Harga spesifik untuk varian, opsional
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  imageUrl: string; // Default image
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
}

export type View = 'home' | 'detail' | 'about';
