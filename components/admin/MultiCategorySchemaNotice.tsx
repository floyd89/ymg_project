
import React from 'react';

const MultiCategorySchemaNotice: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl my-4 animate-view-enter">
    <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-lg">⚠️ Aksi Diperlukan: Aktifkan Fitur Multi-Kategori</p>
            <p className="text-sm mt-2 mb-4">
              Untuk mendukung beberapa kategori per produk, struktur database perlu diperbarui. Kolom <strong>category</strong> di tabel <code>products</code> harus diubah dari tipe <code>text</code> menjadi <code>text[]</code> (array of text).
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
            <li>Di Dashboard Supabase Anda, pergi ke <strong>SQL Editor</strong>.</li>
            <li>Salin dan tempel kueri di bawah ini, lalu klik <strong>"RUN"</strong>.</li>
          </ol>
          <pre className="mt-2 text-[10px] bg-yellow-200 text-yellow-900 p-2 rounded-md overflow-x-auto">
            <code>
{`-- Mengubah tipe kolom 'category' menjadi array of text
-- Kueri ini akan secara otomatis mengubah data kategori yang ada menjadi format array.
ALTER TABLE public.products
ALTER COLUMN category TYPE text[] USING array[category];`}
            </code>
          </pre>
          <p className="text-[11px] mt-2 font-bold">Setelah berhasil, refresh halaman ini. Fitur multi-kategori akan aktif.</p>
      </div>
    </div>
  </div>
);

export default MultiCategorySchemaNotice;
