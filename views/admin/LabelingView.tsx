
import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { settingsService } from '../../services/settingsService';
import { AppSettings } from '../../types';

const LabelingView: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk kustomisasi warna QR Code
  const [fgColor, setFgColor] = useState('#2d3748'); // Warna titik
  const [bgColor, setBgColor] = useState('#ffffff'); // Warna latar
  const [eyeColor, setEyeColor] = useState('#2d3748'); // Warna khusus untuk pola sudut

  // State untuk menyimpan URL logo yang aman dari CORS
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

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

  // PERBAIKAN: Efek untuk memuat logo dan mengubahnya menjadi Data URL
  // Ini mencegah masalah "tainted canvas" karena Cross-Origin (CORS) saat mengunduh.
  useEffect(() => {
    if (!settings) return;

    const logoUrl = settings.storeLogoUrl;

    if (!logoUrl || logoUrl.startsWith('data:')) {
      setLogoDataUrl(logoUrl || null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Atribut krusial untuk CORS
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setLogoDataUrl(canvas.toDataURL());
      } else {
        console.warn("Gagal membuat canvas context untuk konversi logo.");
        setLogoDataUrl(logoUrl); // Fallback ke URL asli
      }
    };
    
    img.onerror = () => {
      console.warn("Gagal memuat logo dengan crossOrigin='Anonymous'. Ini bisa jadi masalah CORS di bucket storage Anda. Download QR mungkin akan gagal.");
      setLogoDataUrl(logoUrl); // Fallback ke URL asli
    };
    
    img.src = logoUrl;
  }, [settings]);

  // Efek untuk menggambar ulang 'mata' QR code dengan warna kustom
  useEffect(() => {
    if (isLoading || !printRef.current || eyeColor === fgColor) return;

    const canvas = printRef.current.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    
    const totalModules = 37; 
    const scale = size / totalModules;
    const eyeSize = 7 * scale;
    const margin = 4 * scale;

    const drawEye = (x: number, y: number) => {
        const moduleSize = eyeSize / 7;
        ctx.fillStyle = eyeColor;
        ctx.fillRect(x, y, eyeSize, eyeSize);

        ctx.fillStyle = bgColor;
        ctx.fillRect(x + moduleSize, y + moduleSize, eyeSize - 2 * moduleSize, eyeSize - 2 * moduleSize);

        ctx.fillStyle = eyeColor;
        ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, eyeSize - 4 * moduleSize, eyeSize - 4 * moduleSize);
    };
    
    const timer = setTimeout(() => {
      drawEye(margin, margin);
      drawEye(size - eyeSize - margin, margin);
      drawEye(margin, size - eyeSize - margin);
    }, 0);

    return () => clearTimeout(timer);

  }, [fgColor, bgColor, eyeColor, isLoading, logoDataUrl]); // Tambahkan logoDataUrl sebagai dependency


  const handleDownload = () => {
    const container = printRef.current;
    if (!container) return;

    const canvas = container.querySelector('canvas');
    if (!canvas) {
      alert("QR Code tidak dapat ditemukan untuk diunduh.");
      return;
    }
    
    try {
        // Buat canvas baru untuk menggabungkan QR dan teks
        const offscreenCanvas = document.createElement('canvas');
        const ctx = offscreenCanvas.getContext('2d');
        if (!ctx) return;

        const padding = 30;
        const textBlockHeight = 70; // Beri ruang lebih untuk teks
        
        offscreenCanvas.width = canvas.width + padding * 2;
        offscreenCanvas.height = canvas.height + padding + textBlockHeight;

        // Latar belakang
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // Gambar QR code ke canvas baru
        ctx.drawImage(canvas, padding, padding);

        // Tambahkan teks di bawah QR code
        ctx.fillStyle = '#2d3748';
        ctx.textAlign = 'center';
        
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText("Pindai untuk Keaslian Produk", offscreenCanvas.width / 2, canvas.height + padding + 35);
        
        ctx.font = '14px monospace';
        ctx.fillStyle = '#555555';
        ctx.fillText(window.location.origin, offscreenCanvas.width / 2, canvas.height + padding + 60);

        // Trigger download
        const link = document.createElement('a');
        link.download = 'ymg-qrcode-label.png';
        link.href = offscreenCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Download failed:", e);
        alert("Gagal mengunduh gambar. Ini mungkin karena masalah CORS pada gambar logo. Pastikan bucket Supabase Anda dikonfigurasi dengan benar untuk akses publik.");
    }
  };
  
  const resetColors = () => {
    setFgColor('#2d3748');
    setBgColor('#ffffff');
    setEyeColor('#2d3748');
  };

  return (
    <div className="animate-view-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Labeling & Verifikasi</h1>
        <p className="text-slate-500 mt-1">Buat QR code kustom dengan logo untuk verifikasi keaslian produk.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* QR Code Preview & Customization */}
          <div className="w-full md:w-auto flex-shrink-0">
            <div ref={printRef} className="p-6 border-2 border-dashed border-slate-300 rounded-lg inline-flex flex-col items-center">
              {isLoading || (settings && !logoDataUrl && settings.storeLogoUrl) ? (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-md">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                </div>
              ) : (
                <QRCodeCanvas
                  value={verificationUrl}
                  size={200}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={"H"} // High error correction for logo inclusion
                  includeMargin={true}
                  imageSettings={logoDataUrl ? {
                    src: logoDataUrl,
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
            
            {/* Color Customization */}
            <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 w-full max-w-xs">
                <h4 className="text-xs font-bold text-slate-600 mb-3">Kustomisasi Tampilan</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label htmlFor="fgColor" className="text-sm font-medium text-slate-800">Warna Titik QR</label>
                        <input type="color" id="fgColor" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="eyeColor" className="text-sm font-medium text-slate-800">Warna Pola Pojok</label>
                        <input type="color" id="eyeColor" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="bgColor" className="text-sm font-medium text-slate-800">Warna Latar</label>
                        <input type="color" id="bgColor" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer" />
                    </div>
                </div>
                <button onClick={resetColors} className="text-xs font-bold text-slate-500 hover:underline mt-3">Reset Warna</button>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800">QR Code Kustom Anda</h3>
            <p className="text-sm text-slate-600 mt-2 mb-4">
              QR code ini secara otomatis menampilkan logo toko Anda di tengahnya. Anda juga dapat mengubah warna titik dan latar belakang agar sesuai dengan branding Anda.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
              <li>Saat pelanggan memindai, mereka akan diarahkan ke halaman verifikasi.</li>
              <li>Jika Anda mengubah logo di Pengaturan, QR code di sini akan otomatis ter-update.</li>
              <li>Gunakan tombol unduh untuk menyimpan gambar label ke perangkat Anda.</li>
            </ul>
            <button 
              onClick={handleDownload}
              disabled={isLoading}
              className="mt-6 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 flex items-center justify-center gap-2 disabled:bg-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelingView;
