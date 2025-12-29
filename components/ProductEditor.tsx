
import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductVariant } from '../types';
import { uploadImage } from '../utils/imageConverter';

interface ProductEditorProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      // Pastikan imageUrls selalu array, bahkan jika data lama/null
      const initialData = {
          ...product,
          imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [],
      };
      setProductData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [product]);

  const handleImageFilesUpload = (files: FileList | null) => {
    if (!files || !productData) return;
    const currentImageCount = productData.imageUrls.length;
    const availableSlots = 6 - currentImageCount;
    if (availableSlots <= 0) {
        alert("Anda sudah mencapai batas maksimal 6 foto.");
        return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    
    filesToUpload.forEach(file => {
        const uploadKey = `new-${file.name}-${Date.now()}`;
        setIsUploading(prev => ({ ...prev, [uploadKey]: true }));
        uploadImage(file)
            .then(url => {
                setProductData(prev => {
                    if (!prev) return null;
                    return { ...prev, imageUrls: [...prev.imageUrls, url] };
                });
            })
            .catch(error => {
                console.error("Error uploading image:", error);
                alert(`Gagal mengunggah ${file.name}.`);
            })
            .finally(() => {
                setIsUploading(prev => {
                    const newUploading = { ...prev };
                    delete newUploading[uploadKey];
                    return newUploading;
                });
            });
    });
  };
  
  const removeImage = (indexToRemove: number) => {
    setProductData(prev => {
        if (!prev) return null;
        const newImageUrls = prev.imageUrls.filter((_, index) => index !== indexToRemove);
        return { ...prev, imageUrls: newImageUrls };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => prev ? { ...prev, [name]: value } : null);
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

  const addVariant = () => {
    setProductData(prev => {
      if (!prev) return null;
      const newVariant: ProductVariant = {
        id: `variant-${Date.now()}`,
        colorName: '',
        colorHex: '#000000',
        price: '',
      };
      return { ...prev, variants: [...prev.variants, newVariant] };
    });
  };

  const removeVariant = (index: number) => {
    setProductData(prev => {
      if (!prev) return null;
      const newVariants = prev.variants.filter((_, i) => i !== index);
      return { ...prev, variants: newVariants };
    });
  };
  
  // Drag and Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex || !productData) return;
    
    const newImageUrls = [...productData.imageUrls];
    const draggedItem = newImageUrls.splice(draggedIndex, 1)[0];
    newImageUrls.splice(dropIndex, 0, draggedItem);
    
    setProductData({ ...productData, imageUrls: newImageUrls });
    setDraggedIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productData) {
      if (productData.imageUrls.length === 0) {
        alert("Mohon unggah setidaknya satu foto produk.");
        return;
      }
      onSave(productData);
    }
  };

  if (!productData) return null;
  const isAnyUploading = Object.values(isUploading).some(status => status);

  return (
    <div className="bg-white p-4 md:p-10 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-black text-slate-900 mb-8">{product?.id.startsWith('new-product') ? 'Tambah Produk Baru' : 'Edit Produk'}</h2>
        
        <div className="space-y-8">
          {/* Section: Basic Info */}
          <div className="space-y-4">
              <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Nama Produk" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="category" value={productData.category} onChange={handleChange} placeholder="Kategori" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
                <input type="text" name="price" value={productData.price} onChange={handleChange} placeholder="Harga Utama" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
              </div>
              <textarea name="fullDescription" value={productData.fullDescription} onChange={handleChange} placeholder="Deskripsi Lengkap" required rows={4} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
          </div>

          {/* Section: Product Images */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-slate-800">Foto Produk (Maks. 6)</h3>
            <p className="text-xs text-slate-500 mb-4">Foto pertama akan menjadi foto utama. Seret untuk mengubah urutan. Rekomendasi ukuran: 1080x1080 piksel.</p>
            {productData.imageUrls.length > 0 && <p className="text-xs font-bold text-green-600 bg-green-50 p-2 rounded-md mb-4">✓ Foto utama sudah diisi.</p>}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {productData.imageUrls.map((url, index) => (
                <div 
                  key={url + index} 
                  className={`relative aspect-square group rounded-lg overflow-hidden border-2 ${draggedIndex === index ? 'border-emerald-500' : 'border-slate-200'}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <img src={url} alt={`Produk ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && <span className="absolute bottom-1 left-1 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Utama</span>}
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black">X</button>
                </div>
              ))}
              {productData.imageUrls.length < 6 && (
                <label className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                  <span className="text-[10px] font-bold mt-1 text-center">Tambah Foto</span>
                  <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0" onChange={(e) => handleImageFilesUpload(e.target.files)} />
                </label>
              )}
            </div>
          </div>
          
          {/* Section: Variants */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Varian Produk</h3>
            <div className="space-y-4">
              {productData.variants.map((variant, index) => (
                <div key={variant.id} className="flex flex-col md:flex-row gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-full md:w-auto grid grid-cols-2 md:grid-cols-1 gap-2">
                        <input type="text" name="colorName" value={variant.colorName} onChange={e => handleVariantChange(index, e)} placeholder="Nama Warna" required className="w-full p-2 rounded-md border-slate-300 font-medium text-sm" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md border border-slate-200 shrink-0" style={{ backgroundColor: variant.colorHex || '#FFFFFF' }}></div>
                            <input type="text" name="colorHex" value={variant.colorHex} onChange={e => handleVariantChange(index, e)} placeholder="#RRGGBB" className="w-full p-2 rounded-md border-slate-300 font-medium text-sm" />
                        </div>
                    </div>
                    <input type="text" name="price" value={variant.price} onChange={e => handleVariantChange(index, e)} placeholder="Harga Varian (opsional)" className="w-full md:flex-1 p-2 rounded-md border-slate-300 font-medium text-sm" />
                    <button type="button" onClick={() => removeVariant(index)} className="w-full md:w-auto text-red-500 hover:text-red-700 font-bold text-xs justify-self-end bg-red-50 px-3 py-2 rounded-md">HAPUS</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariant} className="mt-4 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-300">Tambah Varian</button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-10">
          <button type="button" onClick={onCancel} className="px-6 py-3 bg-slate-100 text-slate-800 rounded-xl text-sm font-bold hover:bg-slate-200">Batal</button>
          <button type="submit" disabled={isAnyUploading} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-wait">
            {isAnyUploading ? 'Menunggu Unggahan...' : 'Simpan Produk'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;
