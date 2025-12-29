
import React from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onRemove: (cartId: string) => void;
  onBack: () => void;
}

const CartView: React.FC<CartViewProps> = ({ items, onRemove, onBack }) => {
  const handleCheckout = () => {
    if (items.length === 0) return;

    const phoneNumber = "6281234567890"; // Ganti dengan nomor asli
    const productList = items.map((item, idx) => 
      `${idx + 1}. ${item.product.name} (Warna: ${item.selectedVariant.colorName}, Harga: ${item.product.price})`
    ).join('\n');
    const message = encodeURIComponent(`Halo YMG Official Store, saya ingin memesan tas berikut:\n\n${productList}\n\nMohon informasi selanjutnya untuk total dan pembayaran.`);
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Troli Pesanan</h1>
        <button onClick={onBack} className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:underline">
          Lanjut Belanja
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <p className="text-slate-500 font-bold">Troli Anda masih kosong.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.cartId} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                <img src={item.selectedVariant.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-slate-900">{item.product.name}</h3>
                <p className="text-xs text-slate-500 font-medium mb-1">Warna: {item.selectedVariant.colorName}</p>
                <p className="text-sm font-black text-slate-900">{item.product.price}</p>
              </div>
              <button onClick={() => onRemove(item.cartId)} className="p-2 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}

          <div className="!mt-12 p-6 bg-slate-900 rounded-3xl text-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Item</span>
              <span className="text-xl font-black">{items.length} Produk</span>
            </div>
            <button onClick={handleCheckout} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-700 transition-all transform active:scale-95 uppercase tracking-widest shadow-xl shadow-slate-900/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Pesan via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
