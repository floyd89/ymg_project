
import React from 'react';

const SchemaNotice: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl my-4 animate-view-enter">
    <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-lg">❌ Kesalahan Struktur Database</p>
            <p className="text-sm mt-2 mb-4">
              Gagal menyimpan karena beberapa kolom yang diperlukan (seperti <code>imageUrls</code>, <code>status</code>, atau <code>stock</code>) tidak ditemukan di tabel <code>products</code> Anda.
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
{`-- Menambahkan kolom yang diperlukan untuk fitur terbaru
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS "imageUrls" text[] NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "stock" integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'Draft';

-- Komentar: Perintah ini aman dijalankan berkali-kali.`}
            </code>
          </pre>
          <p className="mt-2 text-[10px] italic">Setelah menjalankan SQL, silakan refresh halaman ini untuk menyegarkan cache skema.</p>
      </div>
       <div>
          <p className="font-bold mt-3 mb-2">Alternatif: Tambah Kolom Melalui Antarmuka</p>
          <p className="text-[10px] mb-2">Pastikan ketiga kolom ini ada di tabel <code>products</code>:</p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-[11px]">
            <li><code>imageUrls</code> (Type: <code>text[]</code>, Array)</li>
            <li><code>stock</code> (Type: <code>int4</code>/<code>integer</code>)</li>
            <li><code>status</code> (Type: <code>text</code>)</li>
          </ul>
      </div>
    </div>
  </div>
);

export default SchemaNotice;
