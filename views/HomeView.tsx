
import React, { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';
import CategoryFilter from '../components/CategoryFilter';

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onProductClick: (id: string) => void;
  onGoProducts: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ products, categories, selectedCategory, onSelectCategory, onProductClick, onGoProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      // Logika filter yang diperbarui untuk mendukung multi-kategori dengan andal.
      // Memastikan `product.category` selalu diperlakukan sebagai array.
      const productCategories = Array.isArray(product.category) ? product.category : [];
      const matchesCategory = selectedCategory === 'Semua' || productCategories.includes(selectedCategory);
      
      const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, products, selectedCategory]);

  return (
    <div className="space-y-8 md:space-y-12 py-6 md:py-10">
      {/* Mobile Header */}
      <header className="md:hidden text-center px-4">
        <div className="flex items-baseline justify-center select-none">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">YMG</span>
          <span className="ml-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Official Store</span>
        </div>
      </header>
      
      {/* Search Bar Section */}
      <section className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari ransel, tote bag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 shadow-sm transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Banner Section */}
      <Banner onExploreClick={onGoProducts} />

      {/* Category Filter Section */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Product Grid Section */}
      <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex justify-center md:justify-start mb-8 md:mb-12">
          <div className="h-1 w-12 bg-slate-900 rounded-full"></div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={onProductClick} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-bold">Produk tidak ditemukan.</p>
            {searchTerm && <p className="text-sm text-slate-400">Coba kata kunci lain atau hapus filter.</p>}
            <button 
              onClick={() => {
                setSearchTerm('');
                onSelectCategory('Semua');
              }}
              className="mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Lihat Semua Produk
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeView;
