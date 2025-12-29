
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import ProductEditor from '../../components/ProductEditor';
import AdminNotice from '../../components/admin/AdminNotice';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../utils/formatters';

const ProductListView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    // Tidak set loading=true di sini, agar update real-time tidak berkedip
    setError(null);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat produk.');
    } finally {
      setIsLoading(false); // Hanya set false setelah load pertama
    }
  }, []);

  useEffect(() => {
    loadProducts();

    // Membuat channel komunikasi real-time untuk admin
    const channel = supabase
      .channel('admin:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Perubahan terdeteksi di panel admin!', payload);
          // Cek jika kita tidak sedang dalam mode edit, untuk menghindari refresh data yang tidak diinginkan
          if (!editingProduct) {
            loadProducts();
          }
        }
      )
      .subscribe();
    
    // Membersihkan koneksi saat keluar dari halaman
    return () => {
      supabase.removeChannel(channel);
    };

  }, [loadProducts, editingProduct]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleAddNew = () => {
    const newProductTemplate: Product = {
      id: `new-product-${Date.now()}`,
      name: '',
      category: '',
      price: '',
      fullDescription: '',
      highlights: [],
      imageUrls: [],
      variants: [],
    };
    setEditingProduct(newProductTemplate);
  };

  const handleSave = async (product: Product) => {
    try {
      await productService.saveProduct(product);
      setEditingProduct(null);
      // Data akan diperbarui secara otomatis oleh subscription,
      // tetapi kita panggil manual untuk memastikan pembaruan instan
      await loadProducts(); 
      alert('Produk berhasil disimpan!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan produk.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini? Ini tidak dapat dibatalkan.')) {
      try {
        await productService.deleteProduct(productId);
        // Data akan diperbarui otomatis, tapi kita panggil manual untuk instan
        await loadProducts(); 
        alert('Produk berhasil dihapus!');
      } catch (err)
 {
        alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus produk.');
      }
    }
  };

  if (editingProduct) {
    return (
      <div className="animate-view-enter">
        <ProductEditor
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingProduct(null)}
        />
      </div>
    );
  }

  const PageNotice: React.FC = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      );
    }
    if (error) {
      return <div className="text-center p-10 font-bold text-red-600 bg-red-50 rounded-xl">{error}</div>;
    }
    if (products.length === 0) {
        return <div className="text-center p-10 font-bold text-slate-500 bg-slate-100 rounded-xl">Belum ada produk. Klik "Tambah Produk Baru" untuk memulai.</div>
    }
    return null;
  }

  return (
    <div className="animate-view-enter">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Produk</h1>
          <p className="text-slate-500 mt-1">Kelola semua produk di toko Anda.</p>
        </div>
        <button onClick={handleAddNew} className="w-full md:w-auto px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">
          Tambah Produk Baru
        </button>
      </div>

      <AdminNotice />
      
      <div className="mt-6">
        <PageNotice />
        {!isLoading && !error && products.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
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
                            <img src={product.imageUrls?.[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-slate-100" />
                            {product.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{product.category}</td>
                        <td className="px-6 py-4 text-slate-600 font-bold">{formatCurrency(product.price)}</td>
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
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                        <div className="flex gap-4">
                            <img src={product.imageUrls?.[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                            <div className="flex-grow">
                                <h3 className="font-bold text-slate-900">{product.name}</h3>
                                <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-md mt-1">{product.category}</p>
                                <p className="font-bold text-slate-800 mt-2">{formatCurrency(product.price)}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-slate-100 mt-4 pt-3">
                            <button onClick={() => handleEdit(product)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg">EDIT</button>
                            <button onClick={() => handleDelete(product.id)} className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-lg">HAPUS</button>
                        </div>
                    </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListView;
