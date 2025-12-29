
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
    // Make sure new product ID is unique
    productToSave.id = productToSave.id.startsWith('new-product-') ? `prod-${Date.now()}` : productToSave.id;
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
