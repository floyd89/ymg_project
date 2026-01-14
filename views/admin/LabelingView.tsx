
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product, AppSettings } from '../../types';
import { productService } from '../../services/productService';
import { settingsService } from '../../services/settingsService';
import { formatCurrency } from '../../utils/formatters';
import { uploadImage } from '../../utils/imageConverter';
import { supabase } from '../../lib/supabaseClient';

type LabelType = 'product' | 'page';

interface StaticPage {
  id: string;
  name: string;
  path: string;
  title: string;
  subtitle: string;
  footerText: string;
  icon?: React.ReactNode;
}

const LabelingView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  
  // State UI
  const [activeTab, setActiveTab] = useState<LabelType>('product');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);

  // State Customization
  const [qrColor, setQrColor] = useState('#0f172a'); // Default Slate-900
  const [qrLogo, setQrLogo] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  const storeUrl = window.location.origin;

  // Definisi Halaman Statis
  const staticPages: StaticPage[] = [
    {
      id: 'authentic',
      name: 'Sertifikat Keaslian (Authentic)',
      path: '/#authentic',
      title: 'CERTIFICATE OF AUTHENTICITY',
      subtitle: 'Scan to Verify Original Product',
      footerText: 'OFFICIAL GUARANTEE',
      icon: (
        <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'home',
      name: 'Halaman Utama Toko',
      path: '/',
      title: 'VISIT OUR STORE',
      subtitle: 'Scan to Explore Collection',
      footerText: 'SHOP ONLINE',
      icon: (
        <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    }
  ];

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
        // Default select first page
        setSelectedPage(staticPages[0]);
        // Default use store logo if available, otherwise null
        if (fetchedSettings?.storeLogoUrl) {
            // Note: We might want to keep it clean by default, but let's leave it null for user to decide
            // setQrLogo(fetchedSettings.storeLogoUrl);
        }
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

  const getDisplayUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    const { data } = supabase.storage.from('store-images').getPublicUrl(path);
    return data ? data.publicUrl : '';
  };

  const handleQrLogoUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const filePath = await uploadImage(file);
      setQrLogo(filePath);
    } catch (error) {
      alert("Gagal mengunggah logo: " + (error instanceof Error ? error.message : "Error unknown"));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="animate-view-enter">
      {/* Header - Hidden when printing */}
      <div className="mb-6 print:hidden">
        <h1 className="text-3xl font-black text-slate-900">Label & Barcode</h1>
        <p className="text-slate-500 mt-1">Buat label QR Code untuk produk atau halaman khusus toko Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Selection Area - Hidden when printing */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('product')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'product' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Label Produk
            </button>
            <button 
              onClick={() => setActiveTab('page')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'page' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Label Halaman
            </button>
          </div>

          {/* List Item Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-h-[400px] flex flex-col">
            {activeTab === 'product' ? (
              <>
                <h3 className="font-bold text-slate-800 mb-4">Pilih Produk</h3>
                <input 
                  type="text" 
                  placeholder="Cari nama produk..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 mb-4 bg-slate-50 rounded-lg border border-slate-200 font-medium text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
                
                <div className="overflow-y-auto pr-2 space-y-2 no-scrollbar flex-grow">
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
              </>
            ) : (
              <>
                <h3 className="font-bold text-slate-800 mb-4">Pilih Halaman</h3>
                <div className="space-y-3 overflow-y-auto pr-2 no-scrollbar flex-grow">
                  {staticPages.map(page => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        selectedPage?.id === page.id 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                          : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${selectedPage?.id === page.id ? 'bg-slate-700' : 'bg-slate-100 text-slate-400'}`}>
                         {page.id === 'authentic' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                         )}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{page.name}</div>
                        <div className={`text-xs mt-0.5 ${selectedPage?.id === page.id ? 'text-slate-300' : 'text-slate-400'}`}>
                          {page.path}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* QR Customization Control */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Kustomisasi Tampilan</h3>
            
            <div className="space-y-4">
               {/* Color Picker */}
               <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Warna Barcode</label>
                  <div className="flex items-center gap-3">
                     <input 
                        type="color" 
                        value={qrColor} 
                        onChange={(e) => setQrColor(e.target.value)} 
                        className="w-10 h-10 rounded cursor-pointer border-none p-0"
                     />
                     <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{qrColor}</span>
                  </div>
               </div>

               {/* Logo Upload */}
               <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Logo Tengah (Opsional)</label>
                  
                  {qrLogo ? (
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <img src={getDisplayUrl(qrLogo)} alt="QR Logo" className="w-10 h-10 object-contain bg-white rounded-md border" />
                        <button 
                            onClick={() => setQrLogo(null)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 ml-auto px-2"
                        >
                            Hapus
                        </button>
                    </div>
                  ) : (
                    <>
                        <input 
                            type="file" 
                            accept="image/*" 
                            id="qr-logo-upload"
                            className="hidden"
                            onChange={(e) => handleQrLogoUpload(e.target.files?.[0] ?? null)}
                        />
                        <label 
                            htmlFor="qr-logo-upload" 
                            className={`flex items-center justify-center gap-2 w-full p-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer ${isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploadingLogo ? (
                                <span>Mengunggah...</span>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span>Upload Logo</span>
                                </>
                            )}
                        </label>
                    </>
                  )}
               </div>
            </div>
          </div>

        </div>

        {/* Preview Area - This is what gets printed */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[600px] print:border-none print:shadow-none print:p-0">
              
              <div className="print:hidden mb-6 flex justify-between w-full items-center">
                <h3 className="font-bold text-slate-800">Pratinjau Label</h3>
                <button 
                  onClick={handlePrint}
                  disabled={activeTab === 'product' ? !selectedProduct : !selectedPage}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Cetak Label
                </button>
              </div>

              {/* TAMPILAN LABEL */}
              {(activeTab === 'product' && selectedProduct) && (
                <div id="print-area" className="border-4 border-slate-900 p-6 w-[350px] bg-white text-center flex flex-col items-center gap-4 break-inside-avoid">
                    <div className="uppercase tracking-[0.2em] text-xs font-bold text-slate-500">
                    {settings?.storeName || 'YMG OFFICIAL STORE'}
                    </div>
                    
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedProduct.name}
                    </h2>
                    
                    <div className="p-2 bg-white rounded-lg">
                    <QRCodeSVG 
                        value={`${storeUrl}/#detail/${selectedProduct.id}`} 
                        size={150}
                        fgColor={qrColor}
                        level={"H"}
                        includeMargin={true}
                        imageSettings={qrLogo ? {
                            src: getDisplayUrl(qrLogo),
                            height: 35,
                            width: 35,
                            excavate: true,
                        } : undefined}
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
              )}

              {(activeTab === 'page' && selectedPage) && (
                 <div id="print-area" className="border-[6px] border-slate-900 p-8 w-[350px] bg-white text-center flex flex-col items-center gap-5 break-inside-avoid relative overflow-hidden">
                    {/* Hiasan Sudut */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-r border-b border-slate-900 bg-slate-900"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-slate-900 bg-slate-900"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-r border-t border-slate-900 bg-slate-900"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-l border-t border-slate-900 bg-slate-900"></div>

                    <div className="mt-2">
                        {selectedPage.icon}
                    </div>

                    <div className="uppercase tracking-[0.2em] text-xs font-black text-slate-900 border-b-2 border-slate-900 pb-2 mb-2 w-full">
                        {settings?.storeName || 'YMG OFFICIAL STORE'}
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                        {selectedPage.title}
                    </h2>
                    
                    <div className="p-2 bg-white border-2 border-slate-900 rounded-xl relative">
                        {/* Sudut-sudut kecil di QR */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-slate-900" style={{ backgroundColor: qrColor }}></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-900" style={{ backgroundColor: qrColor }}></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-slate-900" style={{ backgroundColor: qrColor }}></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-slate-900" style={{ backgroundColor: qrColor }}></div>
                        
                        <QRCodeSVG 
                            value={`${storeUrl}${selectedPage.path}`} 
                            size={160}
                            fgColor={qrColor}
                            level={"H"}
                            includeMargin={false}
                            imageSettings={qrLogo ? {
                                src: getDisplayUrl(qrLogo),
                                height: 40,
                                width: 40,
                                excavate: true,
                            } : undefined}
                        />
                    </div>

                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                        {selectedPage.subtitle}
                    </p>

                    <div className="w-full bg-slate-900 text-white py-2 px-4 rounded-full mt-2" style={{ backgroundColor: qrColor }}>
                         <span className="text-xs font-black tracking-[0.3em] uppercase">
                            {selectedPage.footerText}
                         </span>
                    </div>
                 </div>
              )}

              {/* Empty State */}
              {((activeTab === 'product' && !selectedProduct) || (activeTab === 'page' && !selectedPage)) && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-full flex flex-col items-center justify-center p-10 text-slate-400 print:hidden">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M19.07 4.93L17.07 6.93l-1.41-1.42 2-2 1.41 1.42zm-2.82 2.82l-1.42 1.42-2-2 1.42-1.42 2 2zm-5.66 5.66l-1.41 1.41-2-2 1.41-1.41 2 2z" /></svg>
                    <p className="font-bold">Pilih item di sebelah kiri untuk melihat label.</p>
                </div>
              )}

              <p className="mt-8 text-sm text-slate-400 print:hidden text-center max-w-md">
                Tips: Gunakan kertas label atau kertas thermal. Atur skala cetak di browser agar sesuai dengan ukuran kertas Anda.
              </p>

            </div>
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
            /* Memaksa background graphics muncul saat diprint */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default LabelingView;
