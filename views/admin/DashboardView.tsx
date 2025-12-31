import React from 'react';

// Komponen Kartu Statistik yang dapat digunakan kembali
const StatCard: React.FC<{
  icon: React.ReactElement;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}> = ({ icon, title, value, change, changeType }) => {
  const changeColor = changeType === 'positive' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50';

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
            {icon}
        </div>
      </div>
      <div>
        <p className="text-4xl font-black text-slate-900 tracking-tighter mt-4">{value}</p>
        <div className="flex items-center mt-1">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${changeColor}`}>
            {change}
          </span>
          <span className="text-xs text-slate-400 ml-2">dari kemarin</span>
        </div>
      </div>
    </div>
  );
};


const DashboardView: React.FC = () => {
  return (
    <div className="animate-view-enter space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali! Berikut adalah ringkasan aktivitas toko Anda hari ini.</p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          title="Total View Hari Ini"
          value="1,402"
          change="+12.5%"
          changeType="positive"
        />
        <StatCard 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
          title="Klik 'Beli Sekarang'"
          value="98"
          change="+8.1%"
          changeType="positive"
        />
        <StatCard 
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>}
          title="Klik 'Pesan Sekarang'"
          value="76"
          change="-2.3%"
          changeType="negative"
        />
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