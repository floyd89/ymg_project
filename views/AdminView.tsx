
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import ProductEditor from '../components/ProductEditor';

const AdminView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError("Gagal memuat produk dari database.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleAddNew = () => {
    const newProductTemplate: Product = {
      id: `new-product-${Date.now()}`,
      name: '',
      category: '',
      price: '',
      shortDescription: '',
      fullDescription: '',
      highlights: [],
      imageUrl: '',
      variants: [],
    };
    setEditingProduct(newProductTemplate);
  };

  const handleSave = async (product: Product) => {
    try {
      await productService.saveProduct(product);
      setEditingProduct(null);
      await loadProducts(); // Muat ulang data setelah menyimpan
      alert('Produk berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan produk. Cek konsol untuk detail.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await productService.deleteProduct(productId);
        await loadProducts(); // Muat ulang data setelah menghapus
        alert('Produk berhasil dihapus!');
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus produk. Cek konsol untuk detail.');
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  if (editingProduct) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <ProductEditor
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Panel Admin</h1>
            <p className="text-slate-500 mt-1">Kelola produk di toko Anda.</p>
          </div>
          <button onClick={handleAddNew} className="px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700">
            Tambah Produk Baru
          </button>
        </div>

        {isLoading && <p className="text-center text-slate-500 py-10">Memuat produk...</p>}
        {error && <p className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>}
        
        {!isLoading && !error && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Produk</th>
                    <th scope="col" className="px-6 py-4">Kategori</th>
                    <th scope="col" className="px-6 py-4">Harga</th>
                    <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-4">
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-slate-100" />
                          {product.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{product.category}</td>
                      <td className="px-6 py-4 text-slate-600 font-bold">{product.price}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEdit(product)} className="font-bold text-slate-600 hover:text-slate-900 text-xs">EDIT</button>
                        <button onClick={() => handleDelete(product.id)} className="font-bold text-red-500 hover:text-red-700 text-xs">HAPUS</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
         <div className="text-center mt-8">
            <a href="/" className="text-xs font-bold text-slate-400 hover:text-slate-900">← Kembali ke Toko</a>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
