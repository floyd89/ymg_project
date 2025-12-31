
import React from 'react';

interface AuthenticViewProps {
  onGoHome: () => void;
}

const AuthenticView: React.FC<AuthenticViewProps> = ({ onGoHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      {/* Certificate Card */}
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-300/60 w-full max-w-md animate-view-enter overflow-hidden border border-slate-200/80">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 bg-slate-50/50">
          <div className="flex items-baseline">
            <span className="text-xl font-black text-slate-900 tracking-tighter">YMG</span>
            <span className="ml-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Official Store</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-5 animate-pulse-light shadow-lg shadow-emerald-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">Sertifikat Keaslian</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            Produk Asli Terverifikasi
          </h1>
          <p className="max-w-md mx-auto text-slate-600 font-medium text-base mt-3">
            Terima kasih telah memilih produk original kami. Kualitas dan kepuasan Anda adalah prioritas utama.
          </p>
        </div>
        
        {/* Footer Seal */}
        <div className="bg-slate-50/70 p-5 rounded-b-xl border-t border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6c0 1.887.832 3.565 2.112 4.695.06.055.118.11.175.166l.01.009c.058.056.116.11.172.164L10 18.28l3.53-3.246c.057-.054.114-.108.172-.164l.01-.009c.058-.055.115-.11.175-.166C15.168 11.565 16 9.887 16 8a6 6 0 00-6-6zm-1.586 9.293a.5.5 0 01-.707 0l-2-2a.5.5 0 11.707-.707L8 9.293l2.646-2.647a.5.5 0 01.708.708l-3 3z"/>
                </svg>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quality Assured</span>
            </div>
            <div className="text-right">
                <p className="font-mono text-[10px] text-slate-400">Serial No.</p>
                <p className="font-mono text-xs font-bold text-slate-600">YMG-2024-TS-AUTH</p>
            </div>
        </div>
      </div>
      
      {/* Button */}
      <button 
        onClick={onGoHome} 
        className="mt-8 inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-slate-400/50"
      >
        <span>Jelajahi Koleksi</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>
    </div>
  );
};

export default AuthenticView;
