import React, { useState, useEffect, useMemo } from 'react';
// FIX: Import Order and OrderStatus to correctly type component state and props.
import { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';

const OrderListView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // FIX: Use the explicit OrderStatus type for the filter state.
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      const fetchedOrders = await orderService.getOrders();
      setOrders(fetchedOrders);
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // FIX: Use OrderStatus for the status prop and explicitly type the statusClasses object.
  const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-[10px] font-black rounded-full";
    const statusClasses: Record<OrderStatus, string> = {
      'Diproses': 'bg-blue-100 text-blue-800',
      'Dikirim': 'bg-yellow-100 text-yellow-800',
      'Selesai': 'bg-emerald-100 text-emerald-800',
      'Dibatalkan': 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="animate-view-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Manajemen Pesanan</h1>
        <p className="text-slate-500 mt-1">Lacak dan kelola semua pesanan pelanggan Anda.</p>
      </div>
      
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Cari nama pelanggan atau ID pesanan..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900">
            <option value="all">Semua Status</option>
            <option value="Diproses">Diproses</option>
            <option value="Dikirim">Dikirim</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
      </div>
      
       <div className="mt-6">
        {isLoading && <div className="text-center p-10"><div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div></div>}
        {!isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
                    <tr>
                      <th scope="col" className="px-6 py-4">ID Pesanan</th>
                      <th scope="col" className="px-6 py-4">Pelanggan</th>
                      <th scope="col" className="px-6 py-4">Tanggal</th>
                      <th scope="col" className="px-6 py-4">Total</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{order.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{order.customerName}</td>
                        <td className="px-6 py-4 text-slate-600">{new Date(order.date).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4 font-bold text-slate-600">{formatCurrency(String(order.total))}</td>
                        <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <button className="font-bold text-slate-600 hover:text-slate-900 text-xs">LIHAT</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}
        {filteredOrders.length === 0 && !isLoading && <div className="text-center p-10 font-bold text-slate-500 bg-white rounded-xl border border-slate-200">Tidak ada pesanan yang cocok.</div>}
      </div>
    </div>
  );
};

export default OrderListView;