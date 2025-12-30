
import React from 'react';

interface NavbarProps {
  onGoHome: () => void;
  onGoProducts: () => void;
  onGoAbout: () => void;
  onGoToCart: () => void;
  cartItemCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onGoHome, onGoProducts, onGoAbout, onGoToCart, cartItemCount }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm hidden md:flex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 md:h-20 items-center">
          {/* Left Section - Logo & Links */}
          <div className="flex items-center gap-8">
            <button onClick={onGoHome} className="flex items-center group select-none">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">YMG</span>
                <span className="ml-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Official Store</span>
              </div>
            </button>
            <div className="flex items-center gap-8 text-xs font-bold text-slate-400 border-l border-slate-200 ml-4 pl-8">
              <button onClick={onGoProducts} className="hover:text-slate-900 transition-colors uppercase tracking-widest">
                Produk
              </button>
              <button onClick={onGoAbout} title="Tentang Kami" className="hover:text-slate-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
          </div>

          {/* Right Section - CTA & Cart */}
          <div className="flex items-center gap-4">
            <button onClick={onGoToCart} className="relative p-2 text-slate-400 hover:text-slate-900" aria-label="Keranjang Belanja">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center bg-emerald-500 text-white text-[9px] font-bold rounded-full w-4 h-4">
                        {cartItemCount}
                    </span>
                )}
            </button>
            <button onClick={onGoProducts} className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all transform active:scale-95">
              EXPLORE
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
