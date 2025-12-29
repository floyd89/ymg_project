
import { Product } from '../types';

const getProducts = async (): Promise<Product[]> => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Gagal mengambil data produk');
  }
  return response.json();
};

const saveProduct = async (product: Product): Promise<void> => {
  const isNew = product.id.startsWith('new-product-');
  const url = isNew ? '/api/products' : `/api/products/${product.id}`;
  const method = isNew ? 'POST' : 'PUT';

  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Gagal menyimpan produk`);
  }
};

const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Gagal menghapus produk');
  }
};

export const productService = {
  getProducts,
  saveProduct,
  deleteProduct,
};
