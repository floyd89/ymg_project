
import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingBottomNav from './components/FloatingBottomNav';
import HomeView from './views/HomeView';
import DetailView from './views/DetailView';
import AboutView from './views/AboutView';
import { products } from './data';
import { View, ProductVariant } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId]);

  const handleProductClick = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProductId(id);
      setSelectedVariant(null); // Jangan pilih varian otomatis
      setCurrentView('detail');
      window.scrollTo(0, 0);
    }
  };

  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedProductId(null);
    setSelectedVariant(null);
    window.scrollTo(0, 0);
  };

  const navigateToProducts = () => {
    setCurrentView('home');
    setSelectedProductId(null);
    setSelectedVariant(null);
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navigateToAbout = () => {
    setCurrentView('about');
    setSelectedProductId(null);
    setSelectedVariant(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        onGoHome={navigateToHome} 
        onGoProducts={navigateToProducts} 
        onGoAbout={navigateToAbout}
      />
      
      <main 
        key={currentView}
        className="flex-grow animate-view-enter pb-24 md:pb-0"
      >
        {currentView === 'home' && (
          <HomeView 
            onProductClick={handleProductClick} 
            onGoProducts={navigateToProducts}
          />
        )}
        
        {currentView === 'detail' && selectedProduct && (
          <DetailView 
            product={selectedProduct} 
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
            onBack={navigateToHome}
          />
        )}

        {currentView === 'about' && (
          <AboutView onBack={navigateToHome} />
        )}
      </main>

      {/* Floating Action/Nav - Berubah otomatis berdasarkan view */}
      <FloatingBottomNav 
        onHomeClick={navigateToHome} 
        onAboutClick={navigateToAbout}
        activeProduct={currentView === 'detail' ? selectedProduct : null}
        activeVariant={currentView === 'detail' ? selectedVariant : null}
      />

      <Footer 
        product={currentView === 'detail' ? selectedProduct : null}
        variant={currentView === 'detail' ? selectedVariant : null}
      />
    </div>
  );
};

export default App;
