import React, { useState, useEffect, useCallback } from 'react';
import { analyticsService, AnalyticsEvent } from '../../services/analyticsService';
import { supabase } from '../../lib/supabaseClient';
import AnalyticsSchemaNotice from '../../components/admin/AnalyticsSchemaNotice';

// Helper function to check if a date is today
const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

// Komponen Kartu Statistik yang dapat digunakan kembali
const StatCard: React.FC<{
  icon: React.ReactElement;
  title: string;
  value: string;
  isLoading: boolean;
}> = ({ icon, title, value, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-36">
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
            {icon}
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="h-10 w-24 bg-slate-100 rounded-md animate-pulse mt-4"></div>
        ) : (
          <p className="text-4xl font-black text-slate-900 tracking-tighter mt-4">{Number(value).toLocaleString('id-ID')}</p>
        )}
      </div>
    </div>
  );
};

const DashboardView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({ views: 0, buyClicks: 0, whatsappClicks: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (!isToday(selectedDate)) return; // Hanya perbarui jika melihat hari ini

    const newEvent = payload.new.event_type as AnalyticsEvent;
    if (!newEvent) return;
    
    setStats(currentStats => {
        if (newEvent === 'product_view') return { ...currentStats, views: currentStats.views + 1 };
        if (newEvent === 'buy_now_click') return { ...currentStats, buyClicks: currentStats.buyClicks + 1 };
        if (newEvent === 'whatsapp_click') return { ...currentStats, whatsappClicks: currentStats.whatsappClicks + 1 };
        return currentStats;
    });
  }, [selectedDate]);

  useEffect(() => {
    let channel: any = null;

    const fetchDataForDate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const initialStats = await analyticsService.getStatsForDate(selectedDate);
        setStats(initialStats);

        // Hanya berlangganan update real-time jika tanggal yang dipilih adalah hari ini
        if (isToday(selectedDate)) {
          channel = supabase
            .channel('analytics_events_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analytics_events' }, handleRealtimeUpdate)
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                  console.log('Terhubung ke update analitik real-time.');
                }
                if (status === 'CHANNEL_ERROR' || err) {
                  console.error('Koneksi real-time gagal:', err);
                }
            });
        }

      } catch (err: any) {
        if (err.message && err.message.includes('analytics_events')) {
            setError('SCHEMA_NOT_FOUND');
        } else {
            setError('Gagal memuat data. Periksa koneksi Anda.');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDataForDate();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [selectedDate, handleRealtimeUpdate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
        const [year, month, day] = dateValue.split('-').map(Number);
        setSelectedDate(new Date(year, month - 1, day));
    } else {
        setSelectedDate(new Date());
    }
  };

  const formatDateForInput = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  const title = isToday(selectedDate) 
    ? "Dashboard Real-time" 
    : `Statistik untuk ${selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  
  const subtitle = isToday(selectedDate)
    ? "Ringkasan aktivitas toko Anda untuk hari ini."
    : "Total aktivitas pengunjung pada tanggal yang dipilih.";

  return (
    <div className="animate-view-enter space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="shrink-0">
          <label htmlFor="date-picker" className="sr-only">Pilih Tanggal</label>
          <input
            id="date-picker"
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            max={formatDateForInput(new Date())} // Tidak bisa memilih tanggal di masa depan
            className="w-full md:w-auto p-3 bg-white rounded-xl border-2 border-slate-200 font-bold text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-sm"
          />
        </div>
      </div>

      {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-36 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse"></div>)}
          </div>
      )}

      {!isLoading && error === 'SCHEMA_NOT_FOUND' && (
        <AnalyticsSchemaNotice onDismiss={() => setError(null)} />
      )}
      
      {!isLoading && error && error !== 'SCHEMA_NOT_FOUND' && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg font-bold">
            {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
            {/* Grid Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                title="Total View Hari Ini"
                value={String(stats.views)}
                isLoading={isLoading}
                />
                <StatCard 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                title="Klik 'Beli Sekarang'"
                value={String(stats.buyClicks)}
                isLoading={isLoading}
                />
                <StatCard 
                icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>}
                title="Klik 'Pesan Sekarang'"
                value={String(stats.whatsappClicks)}
                isLoading={isLoading}
                />
            </div>
        </>
      )}
    </div>
  );
};

export default DashboardView;