// FIX: Manually define types for `import.meta.env` to address errors when Vite's client types are not found.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Pesan ini akan muncul di konsol browser jika variabel .env tidak diatur
  console.error("Kesalahan Konfigurasi: Variabel Supabase (VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY) tidak ditemukan. Mohon buat file .env di root proyek dan isi variabel tersebut.");
  // Menampilkan pesan yang lebih ramah di UI
  document.body.innerHTML = `
    <div style="font-family: sans-serif; padding: 2rem; text-align: center; background-color: #FFFBEB; color: #92400E; height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="max-width: 600px;">
        <h1 style="font-size: 1.5rem; font-weight: bold;">Konfigurasi Belum Selesai</h1>
        <p style="margin-top: 1rem;">Aplikasi ini belum terhubung ke Supabase. Mohon ikuti instruksi di panel editor untuk membuat file <strong>.env</strong> dan menambahkan kredensial Supabase Anda.</p>
      </div>
    </div>
  `;
  throw new Error("Supabase URL dan Anon Key harus disediakan di file .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);