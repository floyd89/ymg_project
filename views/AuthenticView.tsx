
import React from 'react';

interface AuthenticViewProps {
  onGoHome: () => void;
}

const AuthenticView: React.FC<AuthenticViewProps> = ({ onGoHome }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-view-enter">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">
        Produk Asli Terverifikasi
      </h1>
      <p className="max-w-md text-slate-500 font-medium">
        Terima kasih telah memilih produk original dari <strong>YMG Official Store</strong>. Kualitas dan kepuasan Anda adalah prioritas kami.
      </p>
      <button 
        onClick={onGoHome} 
        className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-400/50"
      >
        Jelajahi Koleksi Lainnya
      </button>
    </div>
  );
};

export default AuthenticView;
