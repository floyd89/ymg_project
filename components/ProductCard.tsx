
import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <button 
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full text-left"
      onClick={() => onClick(product.id)}
      aria-label={`Lihat detail untuk ${product.name}`}
    >
      <div className="aspect-square overflow-hidden bg-slate-100 relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
      </div>
      <div className="p-3 md:p-6 flex flex-col flex-grow">
        <h3 className="text-xs md:text-xl font-bold text-slate-900 mb-1 md:mb-2 leading-tight group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-[10px] md:text-sm line-clamp-2 mb-3 md:mb-4 leading-relaxed hidden sm:block font-medium">
          {product.shortDescription}
        </p>
        <div className="mt-auto">
          <span className="text-xs md:text-lg font-black text-slate-900 tracking-tight">{formatCurrency(product.price)}</span>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
