
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactElement; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="bg-slate-100 text-slate-600 p-3 rounded-xl">{icon}</div>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
    </div>
    <div className="mt-4 flex items-baseline gap-4">
      <p className="text-3xl font-black text-slate-900">{value}</p>
      {change && (
        <span className={`text-xs font-bold ${changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
          {change}
        </span>
      )}
    </div>
  </div>
);

const ChartPlaceholder: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Grafik Penjualan (30 Hari)</h3>
        <div className="aspect-video bg-slate-50 rounded-xl flex items-center justify-center">
            <p className="text-xs font-bold text-slate-400">Visualisasi data akan muncul di sini.</p>
        </div>
    </div>
);

const DashboardView: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      const allOrders = await orderService.getOrders();
      setRecentOrders(allOrders.slice(0, 5)); // Ambil 5 pesanan terbaru
    };
    fetchRecentOrders();
  }, []);

  const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-[10px] font-black rounded-full";
    const statusClasses = {
      'Diproses': 'bg-blue-100 text-blue-800',
      'Dikirim': 'bg-yellow-100 text-yellow-800',
      'Selesai': 'bg-emerald-100 text-emerald-800',
      'Dibatalkan': 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="animate-view-enter space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali! Ini ringkasan aktivitas toko Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Penjualan" 
          value="Rp 7.8M"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          change="+12.5% vs bln lalu"
          changeType="increase"
        />
        <StatCard 
          title="Total Pesanan" 
          value="152"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          change="-2.1% vs bln lalu"
          changeType="decrease"
        />
        <StatCard 
          title="Produk Terlaris" 
          value="Ransel Urban"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4M14 3v4m-2-2h4M15 17v4m-2-2h4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <ChartPlaceholder />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Pesanan Terbaru</h3>
            <div className="space-y-4">
                {recentOrders.length > 0 ? recentOrders.map(order => (
                    <div key={order.id} className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
                            <p className="text-xs text-slate-400">{order.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800 text-sm">{formatCurrency(String(order.total))}</p>
                            <StatusBadge status={order.status} />
                        </div>
                    </div>
                )) : <p className="text-xs text-slate-400 text-center py-8">Belum ada pesanan.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
