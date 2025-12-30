
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product, Category } from '../../types';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ProductEditor from '../../components/ProductEditor';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../utils/formatters';
import IsActiveSchemaNotice from '../../components/admin/IsActiveSchemaNotice';
import MultiCategorySchemaNotice from '../../components/admin/MultiCategorySchemaNotice';
import PositionSchemaNotice from '../../components/admin/PositionSchemaNotice';

const ProductListView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  const draggedItem = useRef<Product | null>(null);
  const dragOverItem = useRef<Product | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      setProducts(fetchedProducts);
      setOriginalProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setIsOrderChanged(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const channel = supabase.channel('admin:products-categories').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        if (!editingProduct) loadData();
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        if (!editingProduct) loadData();
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadData, editingProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'all' || (Array.isArray(p.category) && p.category.includes(categoryFilter));
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const isFilterActive = useMemo(() => searchTerm !== '' || categoryFilter !== 'all', [searchTerm, categoryFilter]);

  const handleEdit = (product: Product) => setEditingProduct(product);

  const handleAddNew = () => {
    const newProductTemplate: Product = {
      id: `new-product-${Date.now()}`, name: '', category: [], price: '',
      fullDescription: '', highlights: [], imageUrls: [], variants: [], sizes: [], isActive: false,
      position: null
    };
    setEditingProduct(newProductTemplate);
  };

  const handleSave = async (product: Product) => {
    setSaveError(null);
    try {
      await productService.saveProduct(product);
      setEditingProduct(null);
      await loadData(); 
      alert('Produk berhasil disimpan!');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '';
      if (errMsg.includes("'position' column") || errMsg.includes('"position" column')) {
        setSaveError('SCHEMA_MISMATCH_POSITION');
      } else if (errMsg.includes("'sizes' column") || errMsg.includes('"sizes" column')) {
        setSaveError('SCHEMA_MISMATCH_SIZES_JSON');
      } else if (errMsg.includes('column "availableSizes" of relation "products" does not exist')) {
        setSaveError('SCHEMA_MISMATCH_AVAILABLE_SIZES');
      } else if (errMsg.includes('column "size" of relation "products" does not exist')) {
        setSaveError('SCHEMA_MISMATCH_SIZE');
      } else if (errMsg.includes('invalid input syntax for type text[]') || errMsg.includes('malformed array literal')) {
        setSaveError('SCHEMA_MISMATCH_CATEGORY_ARRAY');
      } else if (errMsg.includes("'isActive' column") || errMsg.includes('"isActive" column')) {
        setSaveError('SCHEMA_MISMATCH_ISACTIVE');
      } else if (errMsg.includes("Could not find the 'imageUrls' column")) {
        setSaveError('SCHEMA_MISMATCH_IMAGEURLS');
      } else {
        alert(errMsg || 'Terjadi kesalahan saat menyimpan produk.');
      }
    }
  };
  
  const handleStatusChange = async (product: Product, newStatus: boolean) => {
    setProducts(products.map(p => p.id === product.id ? { ...p, isActive: newStatus } : p));
    
    try {
      await productService.updateProductStatus(product.id, newStatus);
    } catch (err) {
      setProducts(products.map(p => p.id === product.id ? { ...p, isActive: !newStatus } : p));
      const errMsg = err instanceof Error ? err.message : '';
      if (errMsg.includes("'isActive' column") || errMsg.includes('"isActive" column')) {
          setError('SCHEMA_MISMATCH_ISACTIVE');
      } else {
          alert(errMsg || 'Gagal memperbarui status.');
      }
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await productService.deleteProduct(productId);
        await loadData(); 
        alert('Produk berhasil dihapus!');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal menghapus produk.');
      }
    }
  };
  
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortType = e.target.value;
    let sortedProducts = [...products];

    if (sortType === 'name-asc') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'newest') {
        // Asumsi `id` mengandung timestamp. Jika ada `created_at`, itu lebih baik.
        sortedProducts.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else if (sortType === 'oldest') {
        sortedProducts.sort((a, b) => (a.id > b.id ? 1 : -1));
    } else if (sortType === 'custom') {
        sortedProducts = [...originalProducts];
    }
    
    setProducts(sortedProducts);
    setIsOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    const productsToUpdate = products.map((p, index) => ({ id: p.id, position: index }));
    try {
        await productService.updateProductOrder(productsToUpdate);
        alert('Urutan produk berhasil disimpan!');
        await loadData(); // Reload to confirm and reset state
    } catch (err) {
        const errMsg = err instanceof Error ? err.message : '';
        if (errMsg.includes("'position' column") || errMsg.includes('"position" column')) {
            setSaveError('SCHEMA_MISMATCH_POSITION');
        } else {
            alert(errMsg || 'Gagal menyimpan urutan.');
        }
    }
  };

  const handleCancelOrderChange = () => {
      setProducts(originalProducts);
      setIsOrderChanged(false);
  };
  
  const handleDragEnd = () => {
    if (!draggedItem.current || !dragOverItem.current || draggedItem.current.id === dragOverItem.current.id) {
        draggedItem.current = null;
        dragOverItem.current = null;
        return;
    }

    let items = [...products];
    const draggedItemIndex = items.findIndex(p => p.id === draggedItem.current!.id);
    const dragOverItemIndex = items.findIndex(p => p.id === dragOverItem.current!.id);

    // Remove the dragged item from its original position
    const [reorderedItem] = items.splice(draggedItemIndex, 1);
    // Insert it at the new position
    items.splice(dragOverItemIndex, 0, reorderedItem);

    setProducts(items);
    setIsOrderChanged(true);
    
    draggedItem.current = null;
    dragOverItem.current = null;
  };


  if (editingProduct) {
    return (
      <div className="animate-view-enter">
        <ProductEditor
          product={editingProduct} onSave={handleSave}
          onCancel={() => { setEditingProduct(null); setSaveError(null); }}
          saveError={saveError} onDismissSaveError={() => setSaveError(null)}
          categories={categories}
        />
      </div>
    );
  }

  return (
    <div className="animate-view-enter">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manajemen Produk</h1>
          <p className="text-slate-500 mt-1">Tambah, edit, dan kelola semua produk di toko Anda.</p>
        </div>
        <button onClick={handleAddNew} className="w-full md:w-auto px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700">
          Tambah Produk
        </button>
      </div>
      
      {error === 'SCHEMA_MISMATCH_ISACTIVE' && <IsActiveSchemaNotice onDismiss={() => setError(null)} />}
      {saveError === 'SCHEMA_MISMATCH_CATEGORY_ARRAY' && <MultiCategorySchemaNotice onDismiss={() => setSaveError(null)} />}
      {saveError === 'SCHEMA_MISMATCH_POSITION' && <PositionSchemaNotice onDismiss={() => setSaveError(null)} />}


      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="md:col-span-1 w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900" />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="md:col-span-1 w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900">
            <option value="all">Semua Kategori</option>
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
           <select onChange={handleSort} disabled={isFilterActive} className="md:col-span-1 w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="custom">Urutan Kustom</option>
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="name-asc">Nama (A-Z)</option>
          </select>
        </div>
        {isFilterActive && <p className="text-xs text-slate-500 mt-2">Urutan produk hanya dapat diubah jika filter tidak aktif.</p>}
      </div>
       {isOrderChanged && (
        <div className="sticky top-2 z-30 mt-4 bg-slate-800 text-white p-3 rounded-xl flex justify-between items-center shadow-lg animate-view-enter">
          <span className="text-sm font-bold">Anda telah mengubah urutan produk.</span>
          <div className="space-x-2">
            <button onClick={handleCancelOrderChange} className="px-3 py-1 bg-slate-600 rounded-md text-xs font-bold hover:bg-slate-500">Batal</button>
            <button onClick={handleSaveOrder} className="px-3 py-1 bg-white text-slate-900 rounded-md text-xs font-bold hover:bg-slate-200">Simpan Urutan</button>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        {isLoading && <div className="text-center p-10"><div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div></div>}
        {!isLoading && !error && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
                    <tr>
                      <th scope="col" className="px-6 py-4">Produk</th>
                      <th scope="col" className="px-6 py-4">Harga</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id} draggable={!isFilterActive} onDragStart={() => (draggedItem.current = p)} onDragEnter={() => (dragOverItem.current = p)} onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()} className={`border-b border-slate-100 hover:bg-slate-50 ${!isFilterActive ? 'cursor-grab' : ''}`}>
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-4">
                            {!isFilterActive && <span className="text-slate-300">☰</span>}
                            <img src={p.imageUrls?.[0] || 'https://via.placeholder.com/100'} alt={p.name} className="w-10 h-10 rounded-md object-cover bg-slate-100" />
                            <div>
                                {p.name}
                                <p className="font-normal text-xs text-slate-400 max-w-[200px] truncate">{p.category.join(', ')}</p>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-bold">{formatCurrency(p.price)}</td>
                        <td className="px-6 py-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                type="checkbox"
                                checked={p.isActive}
                                onChange={(e) => handleStatusChange(p, e.target.checked)}
                                className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-slate-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                            </label>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleEdit(p)} className="font-bold text-slate-600 hover:text-slate-900 text-xs">EDIT</button>
                          <button onClick={() => handleDelete(p.id)} className="font-bold text-red-500 hover:text-red-700 text-xs">HAPUS</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}
        {filteredProducts.length === 0 && !isLoading && <div className="text-center p-10 font-bold text-slate-500 bg-white rounded-xl border border-slate-200">Tidak ada produk yang cocok dengan filter.</div>}
      </div>
    </div>
  );
};

export default ProductListView;