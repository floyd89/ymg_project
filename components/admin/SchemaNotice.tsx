
import React from 'react';

const SchemaNotice: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl my-4 animate-view-enter">
    <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-lg">❌ Kesalahan Struktur Database</p>
            <p className="text-sm mt-2 mb-4">
              Gagal menyimpan karena error: <strong>"Could not find the 'imageUrls' column"</strong>. Ini berarti tabel <code>products</code> Anda di database Supabase kekurangan kolom yang diperlukan untuk menyimpan daftar gambar produk.
            </p>
        </div>
        {onDismiss && (
            <button onClick={onDismiss} className="text-red-900 font-bold text-xl ml-4 p-1 hover:bg-red-100 rounded-full" aria-label="Tutup Notifikasi">&times;</button>
        )}
    </div>
    <div className="text-xs space-y-3 bg-red-100 p-3 rounded-md">
      <div>
          <p className="font-bold mb-2">Solusi Cepat (Rekomendasi): Jalankan Kueri SQL</p>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>Di Dashboard Supabase Anda, pergi ke <strong>SQL Editor</strong> (ikon <code>&lt;/&gt;</code> di sidebar).</li>
            <li>Klik <strong>"+ New query"</strong>.</li>
            <li>Salin dan tempel kueri di bawah ini, lalu klik <strong>"RUN"</strong>.</li>
          </ol>
          <pre className="mt-2 text-[10px] bg-red-200 text-red-900 p-2 rounded-md overflow-x-auto">
            <code>
{`-- Menambahkan kolom untuk menyimpan daftar URL gambar
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS "imageUrls" text[] NULL DEFAULT '{}';

-- Komentar: Perintah ini aman dijalankan berkali-kali.`}
            </code>
          </pre>
      </div>
       <div>
          <p className="font-bold mt-3 mb-2">Alternatif: Tambah Kolom Melalui Antarmuka</p>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>Pergi ke <strong>Table Editor</strong> (ikon tabel di sidebar).</li>
            <li>Pilih tabel <strong>products</strong>.</li>
            <li>Klik tombol <strong>"+ Add column"</strong> di kanan atas.</li>
            <li>Isi formulir:
                <ul className="list-disc list-inside pl-4 mt-1">
                    <li>Name: <code className="font-bold bg-red-200 p-0.5 rounded">imageUrls</code></li>
                    <li>Type: cari dan pilih <code className="font-bold bg-red-200 p-0.5 rounded">text</code></li>
                    <li>Aktifkan toggle <strong>"Define as array"</strong> di bawah pilihan tipe.</li>
                    <li>Default Value: isi dengan <code className="font-bold bg-red-200 p-0.5 rounded">{`{}`}</code> (kurung kurawal kosong).</li>
                </ul>
            </li>
            <li>Klik <strong>Save</strong>. Setelah berhasil, kembali ke sini dan coba simpan lagi.</li>
          </ol>
      </div>
    </div>
  </div>
);

export default SchemaNotice;
