import React from 'react';

const SetupNotice: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => (
  <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl my-4 animate-view-enter">
    <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-lg">⚠️ Aksi Diperlukan: Atur Penyimpanan Gambar</p>
            <p className="text-sm mt-2 mb-4">
              Pesan error <strong>"Bucket not found"</strong> terdeteksi. Ini berarti aplikasi memerlukan "Bucket" di Supabase Storage untuk menyimpan gambar, tetapi bucket bernama <strong>store-images</strong> belum ada atau tidak dapat diakses.
            </p>
        </div>
        {onDismiss && (
            <button onClick={onDismiss} className="text-yellow-900 font-bold text-xl ml-4 p-1 hover:bg-yellow-100 rounded-full" aria-label="Tutup Notifikasi">&times;</button>
        )}
    </div>
    <div className="text-xs space-y-2 bg-yellow-100 p-3 rounded-md">
      <p className="font-bold">Ikuti langkah-langkah berikut di Dashboard Supabase Anda:</p>
      <ol className="list-decimal list-inside space-y-1">
        <li>Buka proyek Supabase Anda, lalu pergi ke bagian <strong>Storage</strong> (ikon ember di sidebar kiri).</li>
        <li>Klik tombol <strong>"Create a new bucket"</strong>.</li>
        <li>Beri nama bucket persis: <code className="font-bold bg-yellow-200 p-1 rounded">store-images</code></li>
        <li>Aktifkan/centang toggle <strong>"Public bucket"</strong>. Ini sangat penting.</li>
        <li>Biarkan kolom "Allowed file types" kosong untuk mengizinkan semua jenis gambar.</li>
        <li>Klik <strong>"Create bucket"</strong>.</li>
        <li>Setelah berhasil, kembali ke halaman ini dan coba unggah lagi. Anda mungkin perlu me-refresh halaman.</li>
      </ol>
    </div>
  </div>
);

export default SetupNotice;
