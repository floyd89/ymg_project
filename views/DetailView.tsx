
import React, { useEffect, useState } from 'react';
import { Product, ProductVariant } from '../types';

interface DetailViewProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ product, onAddToCart, onBack }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCartClick = () => {
    if (selectedVariant) {
      onAddToCart(product, selectedVariant);
    }
  };

  return (
    <div className="relative bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* === IMAGE COLUMN === */}
        <div className="md:col-span-7 lg:col-span-8 md:sticky md:top-0 md:h-screen">
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <button onClick={onBack} className="absolute top-6 left-4 z-10 group inline-flex items-center gap-3 text-[10px] font-black text-slate-600 hover:text-slate-900 transition-all uppercase tracking-[0.25em]">
              <div className="w-10 h-10 rounded-full border border-slate-900/10 flex items-center justify-center bg-white/70 backdrop-blur-sm group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              <span className="hidden sm:inline bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-900/5">Kembali</span>
            </button>
            <div className="w-full h-full bg-slate-100">
              <img src={selectedVariant?.imageUrl || product.imageUrl} alt={selectedVariant ? `${product.name} - ${selectedVariant.colorName}` : product.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* === DETAILS COLUMN === */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col px-6 pt-10 pb-20 sm:px-12 sm:py-16">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 leading-tight tracking-tighter">{product.name}</h1>
          <div className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">{product.price}</div>

          <div className="mb-8">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">
              Varian Warna {!selectedVariant && <span className="ml-2 text-xs font-normal normal-case text-red-500 animate-pulse">(Pilih satu)</span>}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {product.variants.map(variant => (
                <button key={variant.id} onClick={() => setSelectedVariant(variant)} className={`flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border-2 transition-all duration-300 text-xs font-bold ${selectedVariant?.id === variant.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'}`} aria-label={`Pilih warna ${variant.colorName}`}>
                  <span className={`w-5 h-5 rounded-full block ${selectedVariant?.id === variant.id ? 'ring-2 ring-white/60' : ''}`} style={{ backgroundColor: variant.colorHex }} />
                  <span>{variant.colorName}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium">{product.fullDescription}</p>
          </div>
          
          <div className="mt-auto pt-8">
            <button
              onClick={handleAddToCartClick}
              disabled={!selectedVariant}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-400/50 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H4.72l-.21-1.051A1 1 0 003 1zM8 15a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {selectedVariant ? 'Tambah ke Troli' : 'Pilih Varian Dulu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
