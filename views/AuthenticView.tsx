
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
          <div className="flex items-baseline justify-center">
            <span className="text-xl font-black text-slate-900 tracking-tighter">YMG</span>
            <span className="ml-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Official Store</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-6 animate-pulse-light shadow-lg shadow-emerald-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600 mb-3">Sertifikat Keaslian</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
            Produk Asli Terverifikasi
          </h1>
          <p className="max-w-xs mx-auto text-slate-500 font-medium text-sm leading-relaxed">
            Terima kasih telah memilih produk original kami. Kualitas dan kepuasan Anda adalah prioritas utama.
          </p>
        </div>
        
        {/* Footer Seal */}
        <div className="bg-slate-50/70 p-5 rounded-b-xl border-t border-slate-200/80 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Quality Assured</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticView;