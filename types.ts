
export interface ProductVariant {
  id: string;
  colorName: string;
  imageUrl: string;
  price?: string; // Harga spesifik untuk varian, opsional
  isAvailable: boolean;
}

export interface ProductSize {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface Product {
  id:string;
  name: string;
  category: string[];
  price: string;
  fullDescription: string;
  highlights: string[];
  imageUrls: string[]; 
  variants: ProductVariant[];
  sizes: ProductSize[];
  isActive: boolean;
  position: number | null;
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
  facebookUrl?: string | null;
  telegramUrl?: string | null;
}

export type View = 'home' | 'detail' | 'about' | 'checkout' | 'cart' | 'authentic';

export interface CartItem {
  id: string; // Composite key: `${productId}-${variantId}-${size}`
  product: Product;
  variant: ProductVariant;
  quantity: number;
  size: string; // Ukuran yang dipilih, wajib ada
}

// Tipe data baru untuk manajemen kategori
export interface Category {
  id: number;
  name: string;
  created_at?: string;
  position: number | null;
}

// FIX: Add OrderStatus, OrderItem, and Order types to resolve import errors.
export type OrderStatus = 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}