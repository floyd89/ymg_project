import React, { useState, useEffect } from 'react';

// FIX: Replaced JSX.Element with React.ReactElement to fix "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactElement }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-6">
    <div className="bg-slate-100 text-slate-900 p-3 rounded-xl">{icon}</div>
    <div>
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState({ pageLoads: 0, productClicks: 0 });

  useEffect(() => {
    const pageLoads = parseInt(localStorage.getItem('ymg_pageLoads') || '0', 10);
    const productClicks = parseInt(localStorage.getItem('ymg_productClicks') || '0', 10);
    setStats({ pageLoads, productClicks });
  }, []);

  return (
    <div className="animate-view-enter">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Ringkasan aktivitas di toko Anda (data simulasi).</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Muatan Halaman" 
          value={stats.pageLoads.toLocaleString('id-ID')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard 
          title="Total Klik Produk" 
          value={stats.productClicks.toLocaleString('id-ID')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
      </div>
       <div className="mt-8 text-center bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200 text-xs font-bold">
        Catatan: Data ini hanya simulasi dan dilacak dari aktivitas di peramban Anda saat ini.
      </div>
    </div>
  );
};

export default DashboardView;