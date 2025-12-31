import { supabase } from '../lib/supabaseClient';

export type AnalyticsEvent = 'product_view' | 'buy_now_click' | 'whatsapp_click';

const trackEvent = async (eventType: AnalyticsEvent, productId?: string): Promise<void> => {
  // Fungsi ini dijalankan di sisi klien (toko), jadi kita tidak ingin memblokir UI.
  // Kita kirim event dan tidak menunggu hasilnya (fire and forget).
  supabase
    .from('analytics_events')
    .insert({ event_type: eventType, product_id: productId })
    .then(({ error }) => {
      if (error) {
        // Jangan tampilkan alert ke pengguna, cukup log di konsol untuk debug.
        console.error(`Analytics track event error: ${eventType}`, error.message);
      }
    });
};

const getTodaysStats = async (): Promise<{ views: number; buyClicks: number; whatsappClicks: number }> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_type')
    .gte('created_at', todayISO);
    
  if (error) {
    console.error("Error fetching today's stats:", error);
    // Lemparkan error agar komponen bisa menangkapnya dan menampilkan notifikasi
    throw error;
  }

  const stats = { views: 0, buyClicks: 0, whatsappClicks: 0 };
  if (data) {
    for (const event of data) {
      if (event.event_type === 'product_view') stats.views++;
      else if (event.event_type === 'buy_now_click') stats.buyClicks++;
      else if (event.event_type === 'whatsapp_click') stats.whatsappClicks++;
    }
  }

  return stats;
};

export const analyticsService = {
  trackEvent,
  getTodaysStats,
};