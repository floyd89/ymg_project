
import React from 'react';

const SizesJsonSchemaNotice: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl my-4 animate-view-enter">
    <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-lg">⚠️ Aksi Diperlukan: Perbarui Struktur Ukuran Produk</p>
            <p className="text-sm mt-2 mb-4">
              Fitur baru untuk manajemen ukuran (S, M, L, dll.) memerlukan kolom <strong>"sizes"</strong> dengan tipe <strong>jsonb</strong> di tabel <code>products</code> Anda, tetapi kolom tersebut tidak ditemukan.
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
{`-- Menambahkan kolom 'sizes' untuk menyimpan daftar ukuran sebagai JSON
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS "sizes" jsonb DEFAULT '[]'::jsonb;

-- Komentar: Kueri ini akan menambahkan kolom baru tanpa menghapus data lama.
-- Kolom 'size' dan 'availableSizes' yang lama bisa Anda hapus manual nanti jika sudah tidak diperlukan.`}
            </code>
          </pre>
          <p className="mt-2 text-[10px] italic">Setelah menjalankan SQL, silakan refresh halaman ini. Fitur ukuran produk akan berfungsi.</p>
      </div>
    </div>
  </div>
);

export default SizesJsonSchemaNotice;