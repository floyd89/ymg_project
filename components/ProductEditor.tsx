
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Category } from '../types';
import { uploadImage } from '../utils/imageConverter';
import SetupNotice from './admin/SetupNotice';
import SchemaNotice from './admin/SchemaNotice';

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
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      const initialData = {
          ...product,
          imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [],
          stock: product.stock || 0,
          status: product.status || 'Draft',
          category: product.category || (categories.length > 0 ? categories[0].name : ''),
      };
      setProductData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [product, categories]);

  const handleImageFilesUpload = (files: FileList | null) => {
    if (!files || !productData) return;
    const availableSlots = 6 - productData.imageUrls.length;
    if (availableSlots <= 0) {
        alert("Maksimal 6 foto.");
        return;
    }
    const filesToUpload = Array.from(files).slice(0, availableSlots);
    filesToUpload.forEach(file => {
        const uploadKey = `new-${file.name}-${Date.now()}`;
        setIsUploading(prev => ({ ...prev, [uploadKey]: true }));
        uploadImage(file)
            .then(url => {
                setUploadError(null);
                setProductData(prev => prev ? { ...prev, imageUrls: [...prev.imageUrls, url] } : null);
            })
            .catch(error => {
                if (error.message.includes('Bucket not found')) setUploadError('BUCKET_NOT_FOUND');
                else alert(error.message || `Gagal mengunggah ${file.name}.`);
            })
            .finally(() => setIsUploading(prev => {
                const newUp = { ...prev };
                delete newUp[uploadKey];
                return newUp;
            }));
    });
  };
  
  const removeImage = (index: number) => setProductData(prev => prev ? { ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) } : null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number = value;
    if (name === 'stock') {
        finalValue = parseInt(value, 10) || 0;
    }
    setProductData(prev => prev ? { ...prev, [name]: finalValue } : null);
  };
  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => {
      if (!prev) return null;
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [name]: value };
      return { ...prev, variants: newVariants };
    });
  };
  const addVariant = () => setProductData(prev => prev ? { ...prev, variants: [...prev.variants, { id: `variant-${Date.now()}`, colorName: '', colorHex: '#000000', price: '' }] } : null);
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
        alert("Unggah setidaknya satu foto.");
        return;
      }
      if (!productData.category) {
        alert("Pilih kategori produk.");
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
            <h3 className="font-bold text-slate-800 mb-4">Foto Produk</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {productData.imageUrls.map((url, index) => (
                <div key={url+index} className="relative aspect-square group rounded-lg overflow-hidden border-2" draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}>
                  <img src={url} className="w-full h-full object-cover" />
                  {index === 0 && <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Utama</span>}
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs font-black">X</button>
                </div>
              ))}
              {productData.imageUrls.length < 6 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"><svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg><input type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageFilesUpload(e.target.files)} /></label>
              )}
            </div>
          </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Varian Produk</h3>
            <div className="space-y-3">
              {productData.variants.map((variant, index) => (
                <div key={variant.id} className="flex gap-3 items-center p-3 bg-slate-50 rounded-lg border">
                    <input type="color" name="colorHex" value={variant.colorHex} onChange={e => handleVariantChange(index, e)} className="h-10 w-10 p-0 border-none rounded cursor-pointer bg-transparent" style={{'WebkitAppearance': 'none', 'MozAppearance': 'none', appearance: 'none'}} />
                    <input type="text" name="colorName" value={variant.colorName} onChange={e => handleVariantChange(index, e)} placeholder="Nama Warna" required className="flex-1 p-2 rounded-md border-slate-300 font-medium text-sm" />
                    <input type="text" name="price" value={variant.price} onChange={e => handleVariantChange(index, e)} placeholder="Harga Varian (opsional)" className="w-40 p-2 rounded-md border-slate-300 font-medium text-sm" />
                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700 text-xs font-bold">HAPUS</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariant} className="mt-4 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-300">Tambah Varian</button>
          </div>
        </div>
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Status Produk</h3>
                <select name="status" value={productData.status} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                </select>
                <p className="text-xs text-slate-400 mt-2">'Published' akan tampil di toko, 'Draft' tersembunyi.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Harga & Inventaris</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500">Harga Utama</label>
                        <input type="text" name="price" value={productData.price} onChange={handleChange} placeholder="cth: 64000" required className="w-full p-3 mt-1 bg-slate-50 rounded-lg border border-slate-200 font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500">Kategori</label>
                        <select name="category" value={productData.category} onChange={handleChange} required className="w-full p-3 mt-1 bg-slate-50 rounded-lg border border-slate-200 font-bold">
                            <option value="" disabled>Pilih Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                         {categories.length === 0 && <p className="text-xs text-red-500 mt-1">Belum ada kategori. Tambahkan di halaman Kategori.</p>}
                    </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500">Stok</label>
                        <input type="number" name="stock" value={productData.stock} onChange={handleChange} placeholder="0" required className="w-full p-3 mt-1 bg-slate-50 rounded-lg border border-slate-200 font-bold"/>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </form>
  );
};

export default ProductEditor;
