
import React from 'react';

const PositionSchemaNotice: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl my-4 animate-view-enter">
    <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-lg">⚠️ Aksi Diperlukan: Aktifkan Fitur Urutan Produk</p>
            <p className="text-sm mt-2 mb-4">
              Fitur baru untuk mengatur urutan produk (drag & drop) memerlukan kolom <strong>"position"</strong> dengan tipe <strong>integer</strong> di tabel <code>products</code> Anda, tetapi kolom tersebut tidak ditemukan.
            </p>
        </div>
        {onDismiss && (
            <button onClick={onDismiss} className="text-yellow-900 font-bold text-xl ml-4 p-1 hover:bg-yellow-100 rounded-full" aria-label="Tutup Notifikasi">&times;</button>
        )}
    </div>
    <div className="text-xs space-y-3 bg-yellow-100 p-3 rounded-md">
      <div>
          <p className="font-bold mb-2">Solusi Cepat (Rekomendasi): Jalankan Kueri SQL</p>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>Di Dashboard Supabase Anda, pergi ke <strong>SQL Editor</strong> (ikon <code>&lt;/&gt;</code> di sidebar).</li>
            <li>Klik <strong>"+ New query"</strong>.</li>
            <li>Salin dan tempel kueri di bawah ini, lalu klik <strong>"RUN"</strong>.</li>
          </ol>
          <pre className="mt-2 text-[10px] bg-yellow-200 text-yellow-900 p-2 rounded-md overflow-x-auto">
            <code>
{`-- Menambahkan kolom 'position' untuk menyimpan urutan produk
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS "position" integer;

-- Komentar: Perintah ini aman dijalankan dan hanya akan menambahkan kolom jika belum ada.`}
            </code>
          </pre>
          <p className="mt-2 text-[10px] italic">Setelah menjalankan SQL, silakan refresh halaman ini. Fitur urutan produk akan berfungsi.</p>
      </div>
    </div>
  </div>
);

export default PositionSchemaNotice;