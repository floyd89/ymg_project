
import React, { useState, useEffect, useCallback } from 'react';
import { Category } from '../../types';
import { categoryService } from '../../services/categoryService';
import { supabase } from '../../lib/supabaseClient';
import CategorySchemaNotice from '../../components/admin/CategorySchemaNotice';

const CategoryListView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setError(null);
    try {
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      if (err instanceof Error && err.message.includes('relation "public.categories" does not exist')) {
        setError('SCHEMA_NOT_FOUND');
      } else {
        setError(err instanceof Error ? err.message : 'Gagal memuat kategori.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    const channel = supabase.channel('admin:categories').on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        loadCategories();
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadCategories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await categoryService.addCategory(newCategoryName);
      setNewCategoryName('');
      await loadCategories(); // Refresh list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menambah kategori.');
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${name}"? Ini tidak akan menghapus produk yang menggunakan kategori ini.`)) {
      try {
        await categoryService.deleteCategory(id);
        await loadCategories(); // Refresh list
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal menghapus kategori.');
      }
    }
  };

  return (
    <div className="animate-view-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Manajemen Kategori</h1>
        <p className="text-slate-500 mt-1">Tambah, edit, dan hapus kategori produk Anda.</p>
      </div>

      {error === 'SCHEMA_NOT_FOUND' && <CategorySchemaNotice onDismiss={() => setError(null)} />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Tambah Kategori Baru</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nama kategori..."
                className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
              <button
                type="submit"
                className="w-full px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 disabled:bg-slate-400"
                disabled={!newCategoryName.trim()}
              >
                Tambah
              </button>
            </form>
          </div>
        </div>
        <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             {isLoading && <div className="text-center p-10"><div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div></div>}
             {!isLoading && !error && (
                <ul className="divide-y divide-slate-100">
                  {categories.map(cat => (
                    <li key={cat.id} className="flex justify-between items-center p-4 hover:bg-slate-50">
                      <span className="font-bold text-slate-800">{cat.name}</span>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id, cat.name)} 
                        className="font-bold text-red-500 hover:text-red-700 text-xs"
                      >
                        HAPUS
                      </button>
                    </li>
                  ))}
                  {categories.length === 0 && <li className="text-center p-10 text-slate-500 font-bold">Belum ada kategori.</li>}
                </ul>
             )}
             {error && error !== 'SCHEMA_NOT_FOUND' && <div className="text-center p-10 text-red-500 font-bold">{error}</div>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListView;
