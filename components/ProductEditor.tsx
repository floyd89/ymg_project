
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';

interface ProductEditorProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [productData, setProductData] = useState<Product | null>(null);

  useEffect(() => {
    // Deep copy of the product to avoid mutating the original state
    if (product) {
      setProductData(JSON.parse(JSON.stringify(product)));
    }
  }, [product]);

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
      // Set default image from first variant if not set
      if (!productData.imageUrl && productData.variants.length > 0) {
        productData.imageUrl = productData.variants[0].imageUrl;
      }
      onSave(productData);
    }
  };

  if (!productData) return null;

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-black text-slate-900 mb-8">{product?.id.startsWith('new-product') ? 'Tambah Produk Baru' : 'Edit Produk'}</h2>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Nama Produk" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
            <input type="text" name="category" value={productData.category} onChange={handleChange} placeholder="Kategori" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
          </div>
          <input type="text" name="price" value={productData.price} onChange={handleChange} placeholder="Harga (e.g., Rp 500.000)" required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
          <textarea name="shortDescription" value={productData.shortDescription} onChange={handleChange} placeholder="Deskripsi Singkat" required rows={2} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
          <textarea name="fullDescription" value={productData.fullDescription} onChange={handleChange} placeholder="Deskripsi Lengkap" required rows={4} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
          <input type="text" name="imageUrl" value={productData.imageUrl} onChange={handleChange} placeholder="URL Gambar Utama (opsional, akan menggunakan varian pertama jika kosong)" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />

          {/* Variants */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Varian Produk</h3>
            <div className="space-y-4">
              {productData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <input type="text" name="colorName" value={variant.colorName} onChange={(e) => handleVariantChange(index, e)} placeholder="Nama Warna" required className="md:col-span-1 p-2 rounded-md border-slate-300 font-medium text-sm" />
                  <div className="md:col-span-1 flex items-center gap-2">
                     <input type="color" name="colorHex" value={variant.colorHex} onChange={(e) => handleVariantChange(index, e)} className="h-10 w-10 p-0 border-none rounded-md cursor-pointer" />
                     <input type="text" name="colorHex" value={variant.colorHex} onChange={(e) => handleVariantChange(index, e)} placeholder="Hex" required className="w-full p-2 rounded-md border-slate-300 font-medium text-sm" />
                  </div>
                  <input type="text" name="imageUrl" value={variant.imageUrl} onChange={(e) => handleVariantChange(index, e)} placeholder="URL Gambar Varian" required className="md:col-span-1 p-2 rounded-md border-slate-300 font-medium text-sm" />
                  <button type="button" onClick={() => removeVariant(index)} className="md:col-span-1 text-red-500 hover:text-red-700 font-bold text-xs justify-self-end">HAPUS</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariant} className="mt-4 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-300">Tambah Varian</button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-10">
          <button type="button" onClick={onCancel} className="px-6 py-3 bg-slate-100 text-slate-800 rounded-xl text-sm font-bold hover:bg-slate-200">Batal</button>
          <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700">Simpan Produk</button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;
