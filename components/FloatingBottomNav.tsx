
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { settingsService } from '../services/settingsService';

interface FloatingBottomNavProps {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onGoToCart: () => void;
  cartItemCount: number;
  activeProduct: Product | null;
  activeVariant: ProductVariant | null;
}

const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({ onHomeClick, onAboutClick, onAddToCart, onBuyNow, onGoToCart, cartItemCount, activeProduct, activeVariant }) => {
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await settingsService.getSettings();
      setWhatsAppNumber(settings.whatsAppNumber);
    };
    fetchSettings();
  }, []);

  const handleGeneralChatClick = () => {
    if (!whatsAppNumber) return;
    const message = encodeURIComponent("Halo YMG Official Store, saya ingin bertanya mengenai koleksi tas Anda.");
    window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
  };


  if (activeProduct) {
    const hasVariants = activeProduct.variants.length > 0;
    const isReadyToBuy = !hasVariants || !!activeVariant;

    return (
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-5px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center p-3 gap-3">
          <button
            onClick={onAddToCart}
            disabled={!isReadyToBuy}
            className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors transform active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             <span>Keranjang</span>
          </button>
          <button
            onClick={onBuyNow}
            disabled={!isReadyToBuy}
            className="w-full max-w-xs py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-400/50 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isReadyToBuy ? 'Beli Sekarang' : 'Pilih Varian'}
          </button>
        </div>
      </div>
    );
  }

  // Tampilan navigasi default
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-5px_30px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around py-2 px-2 pb-safe">
        <button onClick={onHomeClick} className="flex flex-col items-center justify-center flex-1 py-1 group active:scale-95 transition-transform" aria-label="Home"><div className="text-slate-900 p-2 rounded-xl"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg></div></button>
        <button onClick={onGoToCart} className="flex flex-col items-center justify-center flex-1 py-1 group active:scale-95 transition-transform relative" aria-label="Keranjang">
            <div className="text-slate-400 p-2 rounded-xl"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></div>
            {cartItemCount > 0 && (
                <span className="absolute top-1 right-5 flex items-center justify-center bg-emerald-500 text-white text-[9px] font-bold rounded-full w-4 h-4">
                    {cartItemCount}
                </span>
            )}
        </button>
        <button onClick={handleGeneralChatClick} className="flex flex-col items-center justify-center flex-1 -mt-10 group" aria-label="Chat via WhatsApp">
          <div className="p-4 rounded-full bg-slate-900 shadow-xl shadow-slate-300/50 ring-4 ring-white transform group-active:scale-90 transition-all"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 mt-2">Chat</span>
        </button>
        <button onClick={onAboutClick} className="flex flex-col items-center justify-center flex-1 py-1 group active:scale-95 transition-transform" aria-label="Tentang Kami"><div className="text-slate-400 p-2 rounded-xl"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg></div></button>
      </div>
    </div>
  );
};

export default FloatingBottomNav;
