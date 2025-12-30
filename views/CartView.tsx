
import React, { useMemo } from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onBack: () => void;
  onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, onUpdateQuantity, onRemoveItem, onBack, onCheckout }) => {

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const priceString = item.variant.price || item.product.price;
      const price = parseInt(priceString.replace(/\D/g, ''), 10) || 0;
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
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

      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-6">Keranjang Belanja</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-bold">Keranjang Anda masih kosong.</p>
          <p className="text-sm text-slate-400">Jelajahi produk kami dan temukan yang Anda suka!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => {
               const itemPrice = parseInt((item.variant.price || item.product.price).replace(/\D/g, ''), 10) || 0;
               return (
                <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                  <img src={item.variant.imageUrl || item.product.imageUrls?.[0]} alt={item.product.name} className="w-24 h-24 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base">{item.product.name}</h3>
                    <p className="text-xs text-slate-500">Varian: {item.variant.colorName} / Ukuran: {item.size}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">{formatCurrency(String(itemPrice))}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-slate-100 rounded-full font-bold text-slate-600">-</button>
                      <span className="font-bold text-sm w-8 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-slate-100 rounded-full font-bold text-slate-600">+</button>
                    </div>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-500 text-xs font-bold">HAPUS</button>
                </div>
               )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Ringkasan Pesanan</h3>
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(String(totalPrice))}</span>
              </div>
              <div className="flex justify-between items-center font-black text-slate-900 text-xl mt-2 pt-4 border-t border-slate-200">
                <span>Total</span>
                <span>{formatCurrency(String(totalPrice))}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full mt-6 px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors transform active:scale-95 shadow-lg shadow-slate-400/50"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;