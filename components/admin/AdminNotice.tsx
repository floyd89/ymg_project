
import React from 'react';

const AdminNotice: React.FC = () => {
  return (
    <div className="bg-green-50 border-l-4 border-green-400 text-green-800 p-4 rounded-r-lg" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM14.7 9.3a1 1 0 0 0-1.4-1.4l-4 4a1 1 0 0 0 1.4 1.4l4-4zM9 11v4h2v-4H9zm0-4h2v2H9V7z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Mode Live: Terhubung ke Database Supabase</p>
          <p className="text-sm">
            Semua perubahan data yang Anda simpan di sini akan langsung diperbarui di database dan terlihat oleh semua pengunjung toko Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotice;
