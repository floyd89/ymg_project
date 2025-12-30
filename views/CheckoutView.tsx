
import React, { useState, useMemo } from 'react';
import { Product, ProductVariant } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CheckoutViewProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onBack: () => void;
  storeWhatsAppNumber: string;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ product, selectedVariant, onBack, storeWhatsAppNumber }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const displayPrice = useMemo(() => selectedVariant?.price || product.price, [selectedVariant, product.price]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerWhatsApp || !customerAddress) {
      alert('Harap lengkapi semua data pemesanan.');
      return;
    }

    let productDetails = `*Produk:* ${product.name}\n`;
    if (selectedVariant) {
      productDetails += `*Varian:* ${selectedVariant.colorName}\n`;
    }
    productDetails += `*Harga:* ${formatCurrency(displayPrice)}\n`;

    const orderSummary = `Halo YMG Official Store, saya ingin memesan:\n\n${productDetails}\nBerikut adalah data pengiriman saya:\n*Nama Penerima:* ${customerName}\n*Nomor WhatsApp:* ${customerWhatsApp}\n*Alamat Lengkap:* ${customerAddress}\n\nMohon konfirmasi ketersediaan dan total biayanya. Terima kasih.`;
    
    const encodedMessage = encodeURIComponent(orderSummary);
    window.open(`https://wa.me/${storeWhatsAppNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <button 
        onClick={onBack}
        className="group mb-8 self-start inline-flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.25em]"
      >
        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center bg-white group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span>Kembali</span>
      </button>

      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">Checkout</h1>
      
      {/* Order Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 flex items-center gap-4">
        <img 
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/100'} 
          alt={product.name}
          className="w-20 h-20 rounded-lg object-cover bg-slate-100"
        />
        <div className="flex-grow">
          <h3 className="font-bold text-slate-800">{product.name}</h3>
          {selectedVariant && <p className="text-xs text-slate-500">Varian: {selectedVariant.colorName}</p>}
          <p className="text-lg font-black text-slate-900 mt-1">{formatCurrency(displayPrice)}</p>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="customerName" className="text-sm font-bold text-slate-700">Nama Penerima</label>
          <input 
            type="text" 
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-3 mt-2 bg-white rounded-lg border-2 border-slate-200 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
            placeholder="Masukkan nama lengkap Anda"
            required 
          />
        </div>
        <div>
          <label htmlFor="customerWhatsApp" className="text-sm font-bold text-slate-700">Nomor WhatsApp</label>
           <p className="text-xs text-slate-400">Contoh: 6281234567890</p>
          <input 
            type="tel" 
            id="customerWhatsApp"
            value={customerWhatsApp}
            onChange={(e) => setCustomerWhatsApp(e.target.value)}
            className="w-full p-3 mt-2 bg-white rounded-lg border-2 border-slate-200 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
            placeholder="Awali dengan 62"
            required 
          />
        </div>
        <div>
          <label htmlFor="customerAddress" className="text-sm font-bold text-slate-700">Alamat Lengkap</label>
          <textarea 
            id="customerAddress"
            rows={4}
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full p-3 mt-2 bg-white rounded-lg border-2 border-slate-200 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
            placeholder="Contoh: Jl. Merdeka No. 10, RT 01/RW 02, Kel. Bahagia, Kec. Sentosa, Kota Ceria, 12345"
            required
          ></textarea>
        </div>
        <button 
          type="submit"
          className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-400/50 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span>Pesan Sekarang</span>
        </button>
      </form>
    </div>
  );
};

export default CheckoutView;
