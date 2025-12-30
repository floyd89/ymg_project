
import React from 'react';

const AuthSetupNotice: React.FC = () => (
  <div className="bg-blue-50 border border-blue-300 text-blue-800 p-4 rounded-xl my-6 animate-view-enter">
    <div className="flex">
      <div className="py-1">
        <svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm-.5-14a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3a.5.5 0 00-.5-.5zM10 14a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      </div>
      <div>
        <p className="font-bold text-lg">Konfigurasi Login Admin</p>
        <p className="text-sm mt-2 mb-4">
          Untuk mengamankan panel admin, Anda perlu membuat pengguna di Supabase.
        </p>
        <div className="text-xs space-y-3 bg-blue-100 p-3 rounded-md">
          <p className="font-bold">Ikuti langkah-langkah berikut di Dashboard Supabase Anda:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Aktifkan Otentikasi Email:</strong>
              <ul className="list-disc list-inside pl-4 text-[11px]">
                <li>Pergi ke <strong>Authentication</strong> (ikon pengguna).</li>
                <li>Pilih <strong>Providers</strong> dan pastikan <strong>Email</strong> sudah aktif (enabled).</li>
              </ul>
            </li>
            <li>
              <strong>Buat Pengguna Admin:</strong>
              <ul className="list-disc list-inside pl-4 text-[11px]">
                <li>Masih di halaman <strong>Authentication</strong>, pilih <strong>Users</strong>.</li>
                <li>Klik <strong>"+ Add user"</strong>.</li>
                <li>Masukkan alamat email dan password yang aman untuk login admin Anda.</li>
                <li>Klik <strong>"Create user"</strong>.</li>
              </ul>
            </li>
            <li>
              <strong>(Penting) Matikan Pendaftaran Pengguna Baru:</strong>
              <ul className="list-disc list-inside pl-4 text-[11px]">
                 <li>Pergi ke <strong>Authentication</strong> &rarr; <strong>Configuration</strong> &rarr; <strong>Providers</strong> &rarr; <strong>Email</strong>.</li>
                 <li>Pastikan toggle <strong>"Enable sign up"</strong> dalam keadaan <strong>OFF</strong>. Ini mencegah orang lain mendaftar di toko Anda.</li>
              </ul>
            </li>
             <li>
              <strong>Login di Sini:</strong>
              <ul className="list-disc list-inside pl-4 text-[11px]">
                <li>Gunakan email dan password yang baru saja Anda buat untuk login ke panel admin ini.</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
);

export default AuthSetupNotice;
