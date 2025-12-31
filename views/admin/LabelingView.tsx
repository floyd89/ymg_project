
import React, { useRef } from 'react';

const LabelingView: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const verificationUrl = `${window.location.origin}/#authentic`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}`;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContents = printContent.innerHTML;
      
      document.body.innerHTML = `
        <html>
          <head>
            <title>Cetak Label</title>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 1cm;
                  text-align: center;
                }
                .print-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  border: 2px dashed #ccc;
                  padding: 20px;
                  page-break-inside: avoid;
                }
                img {
                  width: 150px;
                  height: 150px;
                }
                p {
                  font-family: sans-serif;
                  font-weight: bold;
                  margin-top: 10px;
                  font-size: 10px;
                }
                .url-text {
                  font-size: 8px;
                  font-family: monospace;
                  color: #555;
                }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `;
      window.print();
      document.body.innerHTML = originalContents;
      // Re-initialize React app if needed, though a reload is simpler
      window.location.reload();
    }
  };

  return (
    <div className="animate-view-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Labeling & Verifikasi</h1>
        <p className="text-slate-500 mt-1">Gunakan QR code ini untuk label verifikasi keaslian produk Anda.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div ref={printRef}>
            <div className="print-container p-6 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center">
              <img src={qrCodeUrl} alt="Kode QR Verifikasi" className="w-48 h-48" />
              <p className="mt-4 font-bold text-slate-800 text-center">Pindai untuk Keaslian Produk</p>
              <p className="url-text text-xs text-slate-500 break-all text-center">{verificationUrl}</p>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800">Cara Menggunakan</h3>
            <p className="text-sm text-slate-600 mt-2 mb-4">
              Ini adalah QR code statis yang akan selalu mengarah ke halaman verifikasi "Produk Asli". Cetak kode ini dan tempelkan pada hang tag, kartu garansi, atau kemasan produk Anda.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>Saat pelanggan memindai kode ini, mereka akan langsung dibawa ke halaman verifikasi.</li>
              <li>Kode ini bersifat umum dan dapat digunakan untuk semua produk Anda.</li>
              <li>Tidak ada database yang melacak setiap kode secara individual.</li>
            </ul>
            <button 
              onClick={handlePrint}
              className="mt-6 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelingView;
