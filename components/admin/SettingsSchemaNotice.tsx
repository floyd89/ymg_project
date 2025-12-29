
import React from 'react';

const SettingsSchemaNotice: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl my-4 animate-view-enter">
    <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-lg">❌ Kesalahan Struktur Database Pengaturan</p>
            <p className="text-sm mt-2 mb-4">
              Gagal menyimpan karena beberapa kolom penting (seperti <code>facebookUrl</code>, <code>storeName</code>, dll.) tidak ditemukan di tabel <code>settings</code> Anda. Ini terjadi karena pembaruan terakhir menambahkan fitur profil toko dan media sosial.
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
{`-- Menambahkan kolom yang diperlukan untuk profil toko dan media sosial ke tabel settings
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS "storeName" text,
ADD COLUMN IF NOT EXISTS "storeTagline" text,
ADD COLUMN IF NOT EXISTS "storeLogoUrl" text,
ADD COLUMN IF NOT EXISTS "instagramUrl" text,
ADD COLUMN IF NOT EXISTS "tiktokUrl" text,
ADD COLUMN IF NOT EXISTS "facebookUrl" text,
ADD COLUMN IF NOT EXISTS "telegramUrl" text;

-- Komentar: Perintah ini aman dijalankan berkali-kali.`}
            </code>
          </pre>
      </div>
       <div>
          <p className="font-bold mt-3 mb-2">Alternatif: Tambah Kolom Satu per Satu</p>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>Pergi ke <strong>Table Editor</strong>, pilih tabel <strong>settings</strong>.</li>
            <li>Klik <strong>"+ Add column"</strong> dan tambahkan setiap kolom berikut dengan tipe <strong>text</strong> (biarkan "Allow nullable" tercentang):
                <ul className="list-disc list-inside pl-4 mt-1 font-mono">
                    <li>storeName</li>
                    <li>storeTagline</li>
                    <li>storeLogoUrl</li>
                    <li>instagramUrl</li>
                    <li>tiktokUrl</li>
                    <li>facebookUrl</li>
                    <li>telegramUrl</li>
                </ul>
            </li>
            <li>Setelah semua ditambahkan, kembali ke sini dan coba simpan lagi.</li>
          </ol>
      </div>
    </div>
  </div>
);

export default SettingsSchemaNotice;
