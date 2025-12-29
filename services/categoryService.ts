
import { Category } from '../types';
import { supabase } from '../lib/supabaseClient';

const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
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

  if (selectError) throw selectError;
  if (existing.length > 0) throw new Error(`Kategori "${trimmedName}" sudah ada.`);

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: trimmedName })
    .select()
    .single();

  if (error) {
    console.error("Error adding category:", error);
    throw error;
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
    throw error;
  }
};

export const categoryService = {
  getCategories,
  addCategory,
  deleteCategory,
};
