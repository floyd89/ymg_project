
import React from 'react';

const DashboardView: React.FC = () => {
  return (
    <div className="animate-view-enter space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali! Kelola produk dan pengaturan toko Anda dari sini.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Akses Cepat</h3>
        <p className="text-sm text-slate-500 mb-4">Gunakan menu di samping untuk mulai mengelola toko Anda.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a href="/seller#products" className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors">
                <p className="font-bold text-slate-900">Kelola Produk</p>
                <p className="text-xs text-slate-500">Tambah, edit, atau hapus produk.</p>
            </a>
             <a href="/seller#categories" className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors">
                <p className="font-bold text-slate-900">Kelola Kategori</p>
                <p className="text-xs text-slate-500">Atur kategori untuk produk Anda.</p>
            </a>
             <a href="/seller#settings" className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors">
                <p className="font-bold text-slate-900">Pengaturan Toko</p>
                <p className="text-xs text-slate-500">Ubah informasi kontak dan profil toko.</p>
            </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
