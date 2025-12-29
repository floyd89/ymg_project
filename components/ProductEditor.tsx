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

  useEffect(() => {
    if (product) {
      setProductData(JSON.parse(JSON.stringify(product)));
    }
  }, [product]);
  
  const handleImageUpload = async (file: File | null, uploadKey: string, callback: (url: string) => void) => {
    if (!file) return;
    setIsUploading(prev => ({...prev, [uploadKey]: true}));
    try {
      const imageUrl = await uploadImage(file);
      callback(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Gagal mengunggah gambar. Pastikan bucket storage Anda 'store-images' sudah publik.");
    } finally {
        setIsUploading(prev => ({...prev, [uploadKey]: false}));
    }
  };

  const handleMainImageChange = (file: File | null) => {
    handleImageUpload(file, 'main', (url) => {
      setProductData(prev => prev ? { ...prev, imageUrl: url } : null);
    });
  };

  const handleVariantImageChange = (index: number, file: File | null) => {
    handleImageUpload(file, `variant-${index}`, (url) => {
      setProductData(prev => {
        if (!prev) return null;
        const newVariants = [...prev.variants];
        newVariants[index].imageUrl = url;
        return { ...prev, variants: newVariants };
      });
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
        imageUrl: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productData) {
      if (!productData.imageUrl && productData.variants.length > 0) {
        productData.imageUrl = productData.variants[0].imageUrl;
      }
      onSave(productData);
    }
  };

  if (!productData) return null;
  const isAnyUploading = Object.values(isUploading).some(status => status);

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-black text-slate-900 mb-8">{product?.id.startsWith('new-product') ? 'Tambah Produk Baru' : 'Edit Produk'}</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Nama Produk" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" name="category" value={productData.category} onChange={handleChange} placeholder="Kategori" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
                  <input type="text" name="price" value={productData.price} onChange={handleChange} placeholder="Harga Utama" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                  <img src={productData.imageUrl || 'https://via.placeholder.com/150'} alt="Gambar utama" className="w-32 h-32 object-cover rounded-lg bg-slate-100 mb-2" />
                  <input type="file" accept="image/*" id="main-image-upload" onChange={(e) => handleMainImageChange(e.target.files?.[0] ?? null)} className="hidden"/>
                  <label htmlFor="main-image-upload" className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">{isUploading['main'] ? 'Mengunggah...' : 'Ubah Gambar Utama'}</label>
              </div>
          </div>
          <textarea name="shortDescription" value={productData.shortDescription} onChange={handleChange} placeholder="Deskripsi Singkat" required rows={2} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
          <textarea name="fullDescription" value={productData.fullDescription} onChange={handleChange} placeholder="Deskripsi Lengkap" required rows={4} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
          
          <div className="pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Varian Produk</h3>
            <div className="space-y-4">
              {productData.variants.map((variant, index) => (
                <div key={variant.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-col items-center">
                    <img src={variant.imageUrl || 'https://via.placeholder.com/80'} alt={variant.colorName} className="w-14 h-14 rounded-md object-cover bg-slate-200 mb-1" />
                    <input type="file" accept="image/*" id={`variant-img-${index}`} onChange={e => handleVariantImageChange(index, e.target.files?.[0] ?? null)} className="hidden"/>
                    <label htmlFor={`variant-img-${index}`} className="text-[10px] font-bold text-slate-500 cursor-pointer hover:underline">{isUploading[`variant-${index}`] ? 'Loading...' : 'Upload'}</label>
                  </div>
                  <input type="text" name="colorName" value={variant.colorName} onChange={e => handleVariantChange(index, e)} placeholder="Nama Warna" required className="md:col-span-2 p-2 rounded-md border-slate-300 font-medium text-sm" />
                  <input type="color" name="colorHex" value={variant.colorHex} onChange={e => handleVariantChange(index, e)} className="h-10 w-10 p-0 border-none rounded-md cursor-pointer" />
                  <input type="text" name="price" value={variant.price} onChange={e => handleVariantChange(index, e)} placeholder="Harga Varian (opsional)" className="md:col-span-1 p-2 rounded-md border-slate-300 font-medium text-sm" />
                  <button type="button" onClick={() => removeVariant(index)} className="md:col-span-1 text-red-500 hover:text-red-700 font-bold text-xs justify-self-end">HAPUS</button>
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
