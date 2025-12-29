
import { Product } from '../types';

const LOCAL_STORAGE_KEY = 'ymg_products_catalog';

const initialProducts: Product[] = [
  {
    id: 'urban-explorer-backpack',
    name: 'Urban Explorer Backpack',
    category: 'Backpack',
    price: 'Rp 450.000',
    shortDescription: 'Ransel serbaguna dengan desain modern untuk aktivitas harian dan perjalanan.',
    fullDescription: 'Didesain untuk petualang kota, Urban Explorer Backpack memadukan gaya dan fungsi. Dengan kompartemen laptop empuk dan banyak saku, tas ini siap menemani semua kesibukan Anda dari kantor hingga akhir pekan.',
    highlights: [],
    imageUrl: 'https://picsum.photos/seed/backpack-black/800/600',
    variants: [
      { id: 'ueb-black', colorName: 'Hitam Arang', colorHex: '#333333', imageUrl: 'https://picsum.photos/seed/backpack-black/800/600' },
      { id: 'ueb-navy', colorName: 'Biru Dongker', colorHex: '#1E3A8A', imageUrl: 'https://picsum.photos/seed/backpack-navy/800/600' },
      { id: 'ueb-grey', colorName: 'Abu-abu Batu', colorHex: '#A0AEC0', imageUrl: 'https://picsum.photos/seed/backpack-grey/800/600' },
    ]
  },
  {
    id: 'classic-leather-tote',
    name: 'Classic Leather Tote',
    category: 'Tote Bag',
    price: 'Rp 650.000',
    shortDescription: 'Tas jinjing kulit klasik yang elegan untuk tampilan profesional.',
    fullDescription: 'Tingkatkan gaya Anda dengan Classic Leather Tote. Dibuat dari kulit sintetis premium, tas ini memiliki interior yang luas untuk membawa semua kebutuhan esensial Anda dengan gaya yang tak lekang oleh waktu.',
    highlights: [],
    imageUrl: 'https://picsum.photos/seed/tote-cognac/800/600',
    variants: [
      { id: 'clt-cognac', colorName: 'Coklat Cognac', colorHex: '#9F582A', imageUrl: 'https://picsum.photos/seed/tote-cognac/800/600' },
      { id: 'clt-black', colorName: 'Hitam Klasik', colorHex: '#1A1A1A', imageUrl: 'https://picsum.photos/seed/tote-black/800/600' },
    ]
  },
  {
    id: 'nomad-sling-bag',
    name: 'Nomad Sling Bag',
    category: 'Sling Bag',
    price: 'Rp 280.000',
    shortDescription: 'Tas selempang ringkas dan praktis untuk membawa barang-barang penting.',
    fullDescription: 'Untuk hari-hari saat Anda hanya perlu membawa yang terpenting. Nomad Sling Bag menawarkan kenyamanan dan akses cepat ke barang-barang Anda tanpa mengorbankan gaya. Sempurna untuk jalan-jalan atau konser.',
    highlights: [],
    imageUrl: 'https://picsum.photos/seed/sling-olive/800/600',
    variants: [
      { id: 'nsb-olive', colorName: 'Hijau Zaitun', colorHex: '#556B2F', imageUrl: 'https://picsum.photos/seed/sling-olive/800/600' },
      { id: 'nsb-charcoal', colorName: 'Abu Arang', colorHex: '#4A4A4A', imageUrl: 'https://picsum.photos/seed/sling-charcoal/800/600' },
      { id: 'nsb-khaki', colorName: 'Krem Khaki', colorHex: '#C3B091', imageUrl: 'https://picsum.photos/seed/sling-khaki/800/600' },
    ]
  }
];


const getProducts = (): Product[] => {
  try {
    const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
  } catch (error) {
    console.error("Gagal membaca produk dari localStorage:", error);
    return initialProducts;
  }
};

const saveProduct = (productToSave: Product): void => {
  let products = getProducts();
  const existingProductIndex = products.findIndex(p => p.id === productToSave.id);

  if (existingProductIndex > -1) {
    products[existingProductIndex] = productToSave;
  } else {
    products.push(productToSave);
  }

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Gagal menyimpan produk ke localStorage:", error);
  }
};

const deleteProduct = (productId: string): void => {
  let products = getProducts();
  const updatedProducts = products.filter(p => p.id !== productId);

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
  } catch (error) {
    console.error("Gagal menghapus produk dari localStorage:", error);
  }
};

export const productService = {
  getProducts,
  saveProduct,
  deleteProduct,
};
