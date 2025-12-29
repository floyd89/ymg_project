
import { supabase } from '../lib/supabaseClient';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};


const BUCKET_NAME = 'store-images';

export const uploadImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("Tidak ada file yang dipilih untuk diunggah.");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Gagal mengunggah gambar:', uploadError);
    if (uploadError.message.includes('bucket not found')) {
      throw new Error("Gagal mengunggah: Bucket 'store-images' tidak ditemukan di Supabase Anda. Pastikan nama bucket sudah benar dan sudah dibuat.");
    }
    if (uploadError.message.includes('Ratelimit')) {
      throw new Error("Gagal mengunggah: Terlalu banyak permintaan ke server. Coba lagi dalam beberapa saat.");
    }
    throw new Error('Gagal mengunggah gambar ke Supabase Storage.');
  }

  // PENTING: Kembalikan HANYA nama file (filePath), bukan URL lengkap.
  // Logika di `productService` akan membangun URL lengkap saat data diambil.
  // Ini membuat sistem lebih kuat terhadap perubahan URL Supabase di masa depan.
  return filePath;
};