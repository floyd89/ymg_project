
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Category } from '../types';
import { uploadImage, fileToBase64 } from '../utils/imageConverter';
import SetupNotice from './admin/SetupNotice';
import SchemaNotice from './admin/SchemaNotice';
import { supabase } from '../lib/supabaseClient';
import IsActiveSchemaNotice from './admin/IsActiveSchemaNotice';
import MultiCategorySchemaNotice from './admin/MultiCategorySchemaNotice';
import { formatCurrency, unformatCurrency } from '../utils/formatters';

interface ProductEditorProps {
  product: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
  onCancel: () => void;
  saveError: string | null;
  onDismissSaveError: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, categories, onSave, onCancel, saveError, onDismissSaveError }) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
        // Fungsi parsing rekursif yang kuat untuk membersihkan data kategori.
        const getCategoriesArray = (category: any): string[] => {
            if (!category) {
                return [];
            }
            if (Array.isArray(category)) {
                return category.flatMap(item => getCategoriesArray(item));
            }
            if (typeof category === 'string') {
                let str = category.trim();
                if (str.startsWith('{') && str.endsWith('}')) {
                    str = str.substring(1, str.length - 1);
                }
                return str.split(',').map(c => c.trim().replace(/"/g, '')).filter(Boolean);
            }
            return [];
        };

        const initialData = {
            ...product,
            imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [],
            category: getCategoriesArray(product.category),
        };
        setProductData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [product]);

  const getDisplayUrl = (path: string): string => {
    if (!path || path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    const { data } = supabase.storage.from('store-images').getPublicUrl(path);
    return data ? data.publicUrl : '';
  };

  const handleImageFilesUpload = (files: FileList | null) => {
    if (!files || !productData) return;
    const currentImageCount = productData.imageUrls.length + Object.keys(imagePreviews).length;
    const availableSlots = 6 - currentImageCount;
    if (availableSlots <= 0) {
        alert("Maksimal 6 foto produk utama.");
        return;
    }
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    filesToUpload.forEach(file => {
        const tempId = `preview-${file.name}-${Date.now()}`;
        fileToBase64(file).then(base64 => setImagePreviews(prev => ({ ...prev, [tempId]: base64 })));
        setIsUploading(prev => ({ ...prev, [tempId]: true }));
        uploadImage(file)
            .then(filePath => {
                setUploadError(null);
                setProductData(prev => prev ? { ...prev, imageUrls: [...prev.imageUrls, filePath] } : null);
            })
            .catch(error => {
                if (error.message.includes('Bucket not found')) setUploadError('BUCKET_NOT_FOUND');
                else alert(error.message || `Gagal mengunggah ${file.name}.`);
            })
            .finally(() => {
                setImagePreviews(prev => { const newPreviews = { ...prev }; delete newPreviews[tempId]; return newPreviews; });
                setIsUploading(prev => { const newUp = { ...prev }; delete newUp[tempId]; return newUp; });
            });
    });
  };

  const handleVariantImageUpload = async (index: number, file: File | null) => {
    if (!file) return;
    const uploadKey = `variant-${index}`;
    setIsUploading(prev => ({ ...prev, [uploadKey]: true }));
    try {
      const filePath = await uploadImage(file);
      setProductData(prev => {
        if (!prev) return null;
        const newVariants = [...prev.variants];
        newVariants[index].imageUrl = filePath;
        return { ...prev, variants: newVariants };
      });
      setUploadError(null);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Bucket not found')) {
          setUploadError('BUCKET_NOT_FOUND');
      } else {
          alert(error.message || `Gagal mengunggah gambar varian.`);
      }
    } finally {
      setIsUploading(prev => {
          const newUp = { ...prev };
          delete newUp[uploadKey];
          return newUp;
      });
    }
  };
  
  const removeImage = (index: number) => setProductData(prev => prev ? { ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) } : null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const numericValue = unformatCurrency(value);
      setProductData(prev => prev ? { ...prev, price: numericValue } : null);
    } else {
      setProductData(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

   const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProductData(prev => prev ? { ...prev, [name]: checked } : null);
  };
   const handleCategoryChange = (categoryName: string, isChecked: boolean) => {
    setProductData(prev => {
        if (!prev) return null;
        const currentCategories = Array.isArray(prev.category) ? prev.category : [];
        let newCategories: string[];
        if (isChecked) {
            newCategories = [...currentCategories, categoryName];
        } else {
            newCategories = currentCategories.filter(cat => cat !== categoryName);
        }
        return { ...prev, category: newCategories };
    });
  };
  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => {
      if (!prev) return null;
      const newVariants = [...prev.variants];
      if (name === 'price') {
        (newVariants[index] as any)[name] = unformatCurrency(value);
      } else {
        (newVariants[index] as any)[name] = value;
      }
      return { ...prev, variants: newVariants };
    });
  };
  const addVariant = () => setProductData(prev => prev ? { ...prev, variants: [...prev.variants, { id: `variant-${Date.now()}`, colorName: '', imageUrl: '', price: '' }] } : null);
  const removeVariant = (index: number) => setProductData(prev => prev ? { ...prev, variants: prev.variants.filter((_, i) => i !== index) } : null);
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex || !productData) return;
    const newUrls = [...productData.imageUrls];
    const item = newUrls.splice(draggedIndex, 1)[0];
    newUrls.splice(dropIndex, 0, item);
    setProductData({ ...productData, imageUrls: newUrls });
    setDraggedIndex(null);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productData) {
      if (productData.imageUrls.length === 0) {
        alert("Unggah setidaknya satu foto produk utama.");
        return;
      }
      if (productData.variants.some(v => !v.imageUrl)) {
        alert("Harap unggah gambar untuk setiap varian.");
        return;
      }
      if (!productData.category || productData.category.length === 0) {
        alert("Pilih setidaknya satu kategori produk.");
        return;
      }
      onSave(productData);
    }
  };

  if (!productData) return null;
  const isAnyUploading = Object.values(isUploading).some(status => status);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-900">{product?.id.startsWith('new-product') ? 'Tambah Produk Baru' : 'Edit Produk'}</h2>
        <div className="flex items-center gap-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-bold hover:bg-slate-200">Batal</button>
          <button type="submit" disabled={isAnyUploading} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700 disabled:bg-slate-400">
            {isAnyUploading ? 'Mengunggah...' : 'Simpan'}
          </button>
        </div>
      </div>
      
      {uploadError === 'BUCKET_NOT_FOUND' && <SetupNotice onDismiss={() => setUploadError(null)} />}
      {saveError === 'SCHEMA_MISMATCH_IMAGEURLS' && <SchemaNotice onDismiss={onDismissSaveError} />}
      {saveError === 'SCHEMA_MISMATCH_ISACTIVE' && <IsActiveSchemaNotice onDismiss={onDismissSaveError} />}
      {saveError === 'SCHEMA_MISMATCH_CATEGORY_ARRAY' && <MultiCategorySchemaNotice onDismiss={onDismissSaveError} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Informasi Dasar</h3>
            <div className="space-y-4">
                <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Nama Produk" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold"/>
                <textarea name="fullDescription" value={productData.fullDescription} onChange={handleChange} placeholder="Deskripsi Lengkap" required rows={5} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Foto Produk Utama</h3>
             <p className="text-xs text-slate-400 mb-2">Foto-foto ini akan menjadi galeri utama. Foto varian diatur di bawah.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {productData.imageUrls.map((url, index) => (
                <div key={url+index} className="relative aspect-square group rounded-lg overflow-hidden border-2" draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}>
                  <img src={getDisplayUrl(url)} className="w-full h-full object-cover" />
                  {index === 0 && <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Utama</span>}
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs font-black">X</button>
                </div>
              ))}
              {Object.entries(imagePreviews).map(([id, src]) => (
                <div key={id} className="relative aspect-square group rounded-lg overflow-hidden border-2">
                    <img src={src} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    </div>
                </div>
              ))}
              {(productData.imageUrls.length + Object.keys(imagePreviews).length) < 6 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"><svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg><input type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageFilesUpload(e.target.files)} /></label>
              )}
            </div>
          </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Varian Produk</h3>
            <div className="space-y-3">
              {productData.variants.map((variant, index) => (
                <div key={variant.id} className="flex gap-4 items-center p-3 bg-slate-50 rounded-lg border">
                    <div className="flex-shrink-0 w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center relative">
                        {variant.imageUrl ? (
                            <img src={getDisplayUrl(variant.imageUrl)} className="w-full h-full object-cover rounded-md" alt={`Varian ${variant.colorName}`} />
                        ) : (
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        )}
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => handleVariantImageUpload(index, e.target.files?.[0] ?? null)} />
                        {isUploading[`variant-${index}`] && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md"><div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div></div>}
                    </div>
                    <div className="flex-grow space-y-2">
                        <input type="text" name="colorName" value={variant.colorName} onChange={e => handleVariantChange(index, e)} placeholder="Nama Varian (cth: Merah)" required className="w-full p-2 rounded-md border-slate-300 font-medium text-sm" />
                        <input type="text" name="price" value={formatCurrency(variant.price)} onChange={e => handleVariantChange(index, e)} placeholder="Harga Varian (opsional)" className="w-full p-2 rounded-md border-slate-300 font-medium text-sm" />
                    </div>
                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700 text-xs font-bold self-start">HAPUS</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariant} className="mt-4 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-300">Tambah Varian</button>
          </div>
        </div>
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Harga & Kategori</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500">Harga Utama</label>
                         <p className="text-xs text-slate-400 mb-1">Harga ini akan digunakan jika varian tidak memiliki harga spesifik.</p>
                        <input type="text" name="price" value={formatCurrency(productData.price)} onChange={handleChange} placeholder="cth: Rp 64.000" required className="w-full p-3 mt-1 bg-slate-50 rounded-lg border border-slate-200 font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500">Kategori</label>
                        <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {categories.map(cat => (
                                <div key={cat.id} className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id={`category-checkbox-${cat.id}`}
                                            name={`category-${cat.name}`}
                                            type="checkbox"
                                            checked={productData.category.includes(cat.name)}
                                            onChange={e => handleCategoryChange(cat.name, e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                        <label htmlFor={`category-checkbox-${cat.id}`} className="font-medium text-slate-900 cursor-pointer">
                                            {cat.name}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                         {categories.length === 0 && <p className="text-xs text-red-500 mt-1">Belum ada kategori. Tambahkan di halaman Kategori.</p>}
                    </div>
                </div>
            </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Status Produk</h3>
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                    <label htmlFor="isActive" className="font-bold text-sm text-slate-800">Tampilkan di Toko</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={productData.isActive}
                            onChange={handleToggleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                    </label>
                </div>
            </div>
        </div>
      </div>
    </form>
  );
};

export default ProductEditor;
