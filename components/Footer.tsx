
import React from 'react';
import { Product, ProductVariant } from '../types';

interface FooterProps {
  product?: Product | null;
  variant?: ProductVariant | null;
}

const Footer: React.FC<FooterProps> = ({ product, variant }) => {
  const handleWhatsAppClick = (productName: string, variantName: string) => {
    const phoneNumber = "6281234567890"; // Ganti dengan nomor asli
    const text = `Halo YMG Official Store, saya tertarik dengan produk: ${productName} (Warna: ${variantName}).`;
    const message = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (product) {
    return (
      <footer className="hidden md:flex fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl z-30 border-t border-slate-100 shadow-[0_-5px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-end items-center h-20">
            <button
              onClick={() => variant && handleWhatsAppClick(product.name, variant.colorName)}
              disabled={!variant}
              className="px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-300/40 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {variant ? 'Beli Sekarang' : 'Pilih Varian'}
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-slate-100 py-8 mb-20 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            © 2025 YMG OFFICIAL STORE
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
