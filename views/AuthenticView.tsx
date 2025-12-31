
import React from 'react';

interface AuthenticViewProps {
  onGoHome: () => void;
}

const AuthenticView: React.FC<AuthenticViewProps> = ({ onGoHome }) => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="bg-white border border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-3xl p-8 md:p-12 text-center max-w-lg w-full animate-view-enter">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-6 animate-pulse-light shadow-lg shadow-emerald-500/30">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Brand */}
        <div className="mb-4">
           <span className="text-2xl font-black text-slate-900 tracking-tighter">YMG</span>
           <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Official Store</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3">
          Produk Asli Terverifikasi
        </h1>
        
        {/* Description */}
        <p className="max-w-md mx-auto text-slate-600 font-medium text-base">
          Terima kasih telah memilih produk original kami. Kualitas dan kepuasan Anda adalah prioritas utama.
        </p>
        
        {/* Button */}
        <button 
          onClick={onGoHome} 
          className="mt-10 inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-slate-400/50"
        >
          <span>Jelajahi Koleksi</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default AuthenticView;
