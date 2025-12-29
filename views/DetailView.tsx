
import React, { useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DetailViewProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ product, selectedVariant, onVariantChange, onBack }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedVariant && product.variants.length > 0) {
      onVariantChange(product.variants[0]);
    }
  }, [product, selectedVariant, onVariantChange]);

  const displayPrice = selectedVariant?.price || product.price;
  const hasVariants = product.variants.length > 0;

  return (
    <div className="relative bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12">
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

        <div className="md:col-span-5 lg:col-span-4 flex flex-col px-6 pt-10 pb-20 sm:px-12 sm:py-16">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 leading-tight tracking-tighter">{product.name}</h1>
          <div className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">{formatCurrency(displayPrice)}</div>

          {hasVariants && (
            <div className="mb-8">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">
                Varian Warna {selectedVariant?.price && <span className="text-slate-400">(Harga mungkin berbeda)</span>}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {product.variants.map(variant => (
                  <button key={variant.id} onClick={() => onVariantChange(variant)} className={`flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border-2 transition-all duration-300 text-xs font-bold ${selectedVariant?.id === variant.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'}`} aria-label={`Pilih warna ${variant.colorName}`}>
                    <span className={`w-5 h-5 rounded-full block ${selectedVariant?.id === variant.id ? 'ring-2 ring-white/60' : ''}`} style={{ backgroundColor: variant.colorHex }} />
                    <span>{variant.colorName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">{product.fullDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
