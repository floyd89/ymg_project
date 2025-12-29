
export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string; // e.g., '#333333'
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  imageUrl: string; // Will be used as the default image for the first variant
  variants: ProductVariant[];
}

export type View = 'home' | 'detail' | 'about';
