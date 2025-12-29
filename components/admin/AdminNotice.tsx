
import React from 'react';

const AdminNotice: React.FC = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-r-lg" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 11v4h2v-4H9zm0-4h2v2H9V7z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Pemberitahuan Penting</p>
          <p className="text-sm">
            Semua perubahan data (produk, banner, dll.) hanya tersimpan di peramban ini. Data tidak akan sinkron antar perangkat (misalnya, dari komputer ke HP).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotice;
