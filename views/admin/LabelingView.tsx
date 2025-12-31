
import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { settingsService } from '../../services/settingsService';
import { AppSettings } from '../../types';

const LabelingView: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verificationUrl = `${window.location.origin}/#authentic`;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const fetchedSettings = await settingsService.getSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error("Gagal memuat pengaturan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handlePrint = () => {
    const printElement = printRef.current;
    if (!printElement) return;

    const canvas = printElement.querySelector('canvas');
    if (!canvas) {
      alert("QR Code tidak dapat ditemukan untuk dicetak.");
      return;
    }

    const qrImage = canvas.toDataURL('image/png');
    const labelContent = printElement.querySelector('.print-content-text')?.innerHTML;

    const printWindow = window.open('', '', 'height=500,width=500');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Label</title>
            <style>
              @media print {
                @page { size: 7cm 7cm; margin: 0; }
                body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100%; }
                .print-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  border: 2px dashed #ccc;
                  padding: 20px;
                  page-break-inside: avoid;
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                }
                img { max-width: 80%; max-height: 80%; object-fit: contain; }
                .label-text { font-family: sans-serif; font-weight: bold; margin-top: 15px; font-size: 12px; text-align: center; }
                .url-text { font-size: 8px; font-family: monospace; color: #555; text-align: center; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <img src="${qrImage}" alt="QR Code" />
              <div class="label-text">${labelContent}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="animate-view-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Labeling & Verifikasi</h1>
        <p className="text-slate-500 mt-1">Buat QR code kustom dengan logo untuk verifikasi keaslian produk.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* QR Code Preview */}
          <div className="w-full md:w-auto flex-shrink-0">
            <div ref={printRef} className="p-6 border-2 border-dashed border-slate-300 rounded-lg inline-flex flex-col items-center">
              {isLoading ? (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-md">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                </div>
              ) : (
                <QRCodeCanvas
                  value={verificationUrl}
                  size={200}
                  level={"H"} // High error correction for logo inclusion
                  includeMargin={true}
                  imageSettings={settings?.storeLogoUrl ? {
                    src: settings.storeLogoUrl,
                    height: 40,
                    width: 40,
                    excavate: true,
                  } : undefined}
                />
              )}
               <div className="print-content-text mt-4 text-center">
                 <p className="font-bold text-slate-800">Pindai untuk Keaslian Produk</p>
                 <p className="url-text text-xs text-slate-500 break-all">{window.location.origin}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800">QR Code Kustom Anda</h3>
            <p className="text-sm text-slate-600 mt-2 mb-4">
              QR code ini secara otomatis menampilkan logo toko Anda di tengahnya. Logo diambil dari pengaturan profil toko Anda.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
              <li>Saat pelanggan memindai, mereka akan diarahkan ke halaman verifikasi.</li>
              <li>Jika Anda mengubah logo di Pengaturan, QR code di sini akan otomatis ter-update.</li>
              <li>Gunakan tombol cetak untuk membuat label fisik untuk produk Anda.</li>
            </ul>
            <button 
              onClick={handlePrint}
              disabled={isLoading}
              className="mt-6 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 flex items-center gap-2 disabled:bg-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelingView;
