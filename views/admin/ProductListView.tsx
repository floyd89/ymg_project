
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import ProductEditor from '../../components/ProductEditor';

const ProductListView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = () => {
    setIsLoading(true);
    setProducts(productService.getProducts());
    setIsLoading(false);
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

  const handleSave = (product: Product) => {
    productService.saveProduct(product);
    setEditingProduct(null);
    loadProducts();
    alert('Produk berhasil disimpan!');
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      productService.deleteProduct(productId);
      loadProducts();
      alert('Produk berhasil dihapus!');
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

  return (
    <div className="animate-view-enter">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Produk</h1>
          <p className="text-slate-500 mt-1">Kelola semua produk di toko Anda.</p>
        </div>
        <button onClick={handleAddNew} className="px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700">
          Tambah Produk Baru
        </button>
      </div>
      
      {isLoading && <p>Memuat...</p>}
      {!isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
    </div>
  );
};

export default ProductListView;
