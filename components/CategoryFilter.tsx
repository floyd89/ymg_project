
import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const allCategories = [{ id: 0, name: 'Semua' }, ...categories];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full no-scrollbar overflow-x-auto">
            <div className="flex justify-start gap-3 pb-2">
                {allCategories.map((category) => (
                    <button 
                        key={category.id} 
                        onClick={() => onSelectCategory(category.name)}
                        className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
                            selectedCategory === category.name 
                            ? 'bg-slate-900 text-white shadow-md shadow-slate-200' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        aria-pressed={selectedCategory === category.name}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    </section>
  );
};

export default CategoryFilter;
