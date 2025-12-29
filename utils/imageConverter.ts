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
    throw new Error('Gagal mengunggah gambar.');
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error('Tidak dapat memperoleh URL publik untuk gambar yang diunggah.');
  }

  return data.publicUrl;
};
