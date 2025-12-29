import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductVariant } from '../types';
import { formatCurrency } from '../utils/formatters';
import { settingsService } from '../services/settingsService';

interface DetailViewProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ product, selectedVariant, onVariantChange, onBack }) => {
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product.imageUrls && product.imageUrls.length > 0) {
      setActiveImageUrl(product.imageUrls[0]);
    }
    if (!selectedVariant && product.variants.length > 0) {
      onVariantChange(product.variants[0]);
    }
    const fetchSettings = async () => {
      const settings = await settingsService.getSettings();
      setWhatsAppNumber(settings.whatsAppNumber);
    };
    fetchSettings();
  }, [product, selectedVariant, onVariantChange]);

  const displayPrice = useMemo(() => selectedVariant?.price || product.price, [selectedVariant, product.price]);
  const hasVariants = product.variants.length > 0;
  const hasImages = product.imageUrls && product.imageUrls.length > 0;
  const isReadyToBuy = !hasVariants || !!selectedVariant;

  const handleWhatsAppClick = () => {
    if (!product || !whatsAppNumber) return;
    let message;
    
    if (!hasVariants) {
        message = encodeURIComponent(`Halo YMG Official Store, saya tertarik dengan produk: ${product.name} (Harga: ${formatCurrency(product.price)}). Apakah produk ini masih tersedia?`);
    } else if (selectedVariant) {
        const priceToDisplay = selectedVariant.price || product.price;
        message = encodeURIComponent(`Halo YMG Official Store, saya tertarik dengan produk: ${product.name} (Warna: ${selectedVariant.colorName}, Harga: ${formatCurrency(priceToDisplay)}). Apakah produk ini masih tersedia?`);
    } else {
        return;
    }
    
    window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
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
          
          <div className="mt-auto pt-8 border-t border-slate-100">
             <button
                onClick={handleWhatsAppClick}
                disabled={!isReadyToBuy}
                className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-400/50 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span>{isReadyToBuy ? 'Pesan via WhatsApp' : 'Pilih Varian Dulu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
