
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product, AppSettings } from '../../types';
import { productService } from '../../services/productService';
import { settingsService } from '../../services/settingsService';
import { formatCurrency } from '../../utils/formatters';

const LabelingView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Referensi URL toko untuk QR Code
  const storeUrl = window.location.origin;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedProducts, fetchedSettings] = await Promise.all([
          productService.getProducts(),
          settingsService.getSettings()
        ]);
        setProducts(fetchedProducts);
        setSettings(fetchedSettings);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-view-enter">
      {/* Header - Hidden when printing */}
      <div className="mb-6 print:hidden">
        <h1 className="text-3xl font-black text-slate-900">Label & Barcode</h1>
        <p className="text-slate-500 mt-1">Buat dan cetak label produk dengan QR Code untuk toko fisik atau pengemasan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Selection Area - Hidden when printing */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Pilih Produk</h3>
            <input 
              type="text" 
              placeholder="Cari nama produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 mb-4 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
            
            <div className="h-[400px] overflow-y-auto pr-2 space-y-2 no-scrollbar">
              {isLoading && <div className="text-center py-4">Memuat...</div>}
              {!isLoading && filteredProducts.length === 0 && <div className="text-center py-4 text-slate-400">Tidak ditemukan.</div>}
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    selectedProduct?.id === product.id 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <img src={product.imageUrls?.[0] || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded bg-white object-cover" alt="" />
                  <div>
                    <div className="font-bold text-sm line-clamp-1">{product.name}</div>
                    <div className={`text-xs ${selectedProduct?.id === product.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Area - This is what gets printed */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[500px] print:border-none print:shadow-none print:p-0">
              
              <div className="print:hidden mb-6 flex justify-between w-full items-center">
                <h3 className="font-bold text-slate-800">Pratinjau Label</h3>
                <button 
                  onClick={handlePrint}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Cetak Label
                </button>
              </div>

              {/* The Actual Label Component */}
              <div id="print-area" className="border-4 border-slate-900 p-6 w-[350px] bg-white text-center flex flex-col items-center gap-4 break-inside-avoid">
                <div className="uppercase tracking-[0.2em] text-xs font-bold text-slate-500">
                  {settings?.storeName || 'YMG OFFICIAL STORE'}
                </div>
                
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h2>
                
                <div className="p-2 bg-white rounded-lg">
                   {/* QR Code pointing to the specific product detail page */}
                   <QRCodeSVG 
                      value={`${storeUrl}/#detail/${selectedProduct.id}`} 
                      size={150}
                      level={"H"}
                      includeMargin={true}
                   />
                </div>

                <div className="flex flex-col items-center gap-1">
                   <span className="text-sm font-medium text-slate-400">Harga</span>
                   <span className="text-3xl font-black text-slate-900 tracking-tight">
                     {formatCurrency(selectedProduct.price)}
                   </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono mt-2">
                  ID: {selectedProduct.id}
                </div>
              </div>

              <p className="mt-8 text-sm text-slate-400 print:hidden">
                Tips: Gunakan fitur cetak browser (Ctrl+P) dan atur skala jika diperlukan. Pastikan hanya elemen label yang tercetak.
              </p>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-full flex flex-col items-center justify-center p-10 text-slate-400 print:hidden">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M19.07 4.93L17.07 6.93l-1.41-1.42 2-2 1.41 1.42zm-2.82 2.82l-1.42 1.42-2-2 1.42-1.42 2 2zm-5.66 5.66l-1.41 1.41-2-2 1.41-1.41 2 2z" /></svg>
              <p className="font-bold">Pilih produk di sebelah kiri untuk melihat label.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 400px;
            border: 2px solid #000;
          }
        }
      `}</style>
    </div>
  );
};

export default LabelingView;
