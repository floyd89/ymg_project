import { Category } from '../types';
import { supabase } from '../lib/supabaseClient';

const getCategories = async (): Promise<Category[]> => {
  // Upaya pertama: kueri dengan pengurutan 'position'
  let { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true });

  // Cek apakah error spesifik karena kolom 'position' tidak ada
  if (error && (error.message.includes('column "position" does not exist') || error.message.includes("column categories.position does not exist"))) {
      console.warn("Retrying getCategories without 'position' ordering. The 'position' column seems to be missing.");
      
      // Upaya kedua: coba lagi kueri tanpa pengurutan 'position'
      const retryResult = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
        
      data = retryResult.data;
      error = retryResult.error;
  }
  
  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(`Tidak dapat mengambil data kategori: ${error.message}`);
  }
  return data || [];
};

const addCategory = async (name: string): Promise<Category> => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error('Nama kategori tidak boleh kosong.');
  }

  // Cek duplikat (case-insensitive)
  const { data: existing, error: selectError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', trimmedName)
    .limit(1);

  if (selectError) {
    throw new Error(`Gagal memeriksa duplikasi kategori: ${selectError.message}`);
  }
  if (existing.length > 0) {
    throw new Error(`Kategori "${trimmedName}" sudah ada.`);
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: trimmedName })
    .select()
    .single();

  if (error) {
    console.error("Error adding category:", error);
    throw new Error(`Gagal menambah kategori: ${error.message}`);
  }
  return data;
};

const deleteCategory = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error(`Gagal menghapus kategori: ${error.message}`);
  }
};

const updateCategoryOrder = async (orderedCategories: {id: number, position: number}[]): Promise<void> => {
    const updatePromises = orderedCategories.map(c =>
        supabase
            .from('categories')
            .update({ position: c.position })
            .eq('id', c.id)
    );

    const results = await Promise.all(updatePromises);
    const firstErrorResult = results.find(result => result.error);

    if (firstErrorResult) {
        console.error("Error updating category order:", firstErrorResult.error);
        throw new Error(`Gagal menyimpan urutan kategori: ${firstErrorResult.error!.message}`);
    }
}

export const categoryService = {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategoryOrder,
};