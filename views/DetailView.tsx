
import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductVariant } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DetailViewProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  onBack: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ product, selectedVariant, onVariantChange, onBack, onAddToCart, onBuyNow }) => {
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product.imageUrls && product.imageUrls.length > 0) {
      setActiveImageUrl(product.imageUrls[0]);
    }
    if (!selectedVariant && product.variants.length > 0) {
      onVariantChange(product.variants[0]);
    }
    setQuantity(1); // Reset quantity when product changes
  }, [product, selectedVariant, onVariantChange]);

  const displayPrice = useMemo(() => selectedVariant?.price || product.price, [selectedVariant, product.price]);
  const hasVariants = product.variants.length > 0;
  const hasImages = product.imageUrls && product.imageUrls.length > 0;
  const isReadyToBuy = !hasVariants || !!selectedVariant;

  const handleAddToCart = () => {
    if (isReadyToBuy && selectedVariant) {
      onAddToCart(product, selectedVariant, quantity);
      alert(`${quantity} x ${product.name} (${selectedVariant.colorName}) telah ditambahkan ke keranjang.`);
    } else if (isReadyToBuy && !hasVariants) {
      const dummyVariant = { id: 'default', colorName: 'Default', colorHex: '' };
      onAddToCart(product, dummyVariant, quantity);
      alert(`${quantity} x ${product.name} telah ditambahkan ke keranjang.`);
    }
  };

  const handleBuyNow = () => {
    if (isReadyToBuy && selectedVariant) {
      onBuyNow(product, selectedVariant, quantity);
    } else if (isReadyToBuy && !hasVariants) {
      const dummyVariant = { id: 'default', colorName: 'Default', colorHex: '' };
      onBuyNow(product, dummyVariant, quantity);
    }
  };
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <button onClick={onBack} className="my-6 md:hidden group inline-flex items-center gap-3 text-[10px] font-black text-slate-600 hover:text-slate-900 transition-all uppercase tracking-[0.25em]">
          <div className="w-10 h-10 rounded-full border border-slate-900/10 flex items-center justify-center bg-white/70 backdrop-blur-sm group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </div>
          <span className="bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-900/5">Kembali</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 lg:gap-12 md:pt-12">
        <div className="md:col-span-7 lg:col-span-7">
          <div className="md:sticky md:top-24 self-start">
             <div className="w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden">
              <img src={activeImageUrl || 'https://via.placeholder.com/800'} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {hasImages && product.imageUrls.length > 1 && (
                <div className="w-full mt-4 no-scrollbar overflow-x-auto">
                    <div className="flex justify-start gap-2">
                        {product.imageUrls.map((url, index) => (
                            <button key={index} onClick={() => setActiveImageUrl(url)} className={`w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${activeImageUrl === url ? 'border-slate-900' : 'border-transparent hover:border-slate-400'}`}>
                                <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="md:col-span-5 lg:col-span-5 flex flex-col pt-6 pb-20 md:py-0">
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
          
          <div className="hidden md:block mt-auto pt-8 border-t border-slate-100">
             <div className="flex items-center gap-4 mb-4">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Jumlah</label>
                <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
                    <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 bg-white rounded-full font-bold text-slate-600">-</button>
                    <span className="font-bold text-sm w-8 text-center">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 bg-white rounded-full font-bold text-slate-600">+</button>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={!isReadyToBuy}
                    className="w-full px-6 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors transform active:scale-95 disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span>Keranjang</span>
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={!isReadyToBuy}
                    className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-400/50 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    <span>{isReadyToBuy ? 'Beli Sekarang' : 'Pilih Varian Dulu'}</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
