
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingBottomNav from './components/FloatingBottomNav';
import HomeView from './views/HomeView';
import DetailView from './views/DetailView';
import AboutView from './views/AboutView';
import AdminView from './views/AdminView';
import { View, Product, ProductVariant } from './types';
import { productService } from './services/productService';

const App: React.FC = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    // Also handle custom navigation events if needed in the future
    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return <AdminView />;
  }

  // Storefront Logic
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      try {
        const data = productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError('Gagal memuat produk. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId, products]);

  const handleProductClick = (id: string) => {
    if (products.find(p => p.id === id)) {
      setSelectedProductId(id);
      setSelectedVariant(null);
      setCurrentView('detail');
      window.scrollTo(0, 0);
    }
  };
  
  const navigateTo = (view: View) => {
    setCurrentView(view);
    if (view !== 'detail') {
      setSelectedProductId(null);
      setSelectedVariant(null);
    }
    window.scrollTo(0, 0);
  };

  const navigateToProducts = () => {
    navigateTo('home');
    setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const renderContent = () => {
    if (loading) return <div className="flex-grow flex items-center justify-center"><p className="text-slate-500 font-bold animate-pulse">Memuat produk...</p></div>;
    if (error) return <div className="flex-grow flex items-center justify-center"><div className="text-center p-8 bg-red-50 rounded-2xl"><p className="text-red-600 font-bold">{error}</p></div></div>;

    switch (currentView) {
      case 'home': return <HomeView products={products} onProductClick={handleProductClick} onGoProducts={navigateToProducts} />;
      case 'detail': return selectedProduct && <DetailView product={selectedProduct} selectedVariant={selectedVariant} onVariantChange={setSelectedVariant} onBack={() => navigateTo('home')} />;
      case 'about': return <AboutView onBack={() => navigateTo('home')} />;
      default: return <HomeView products={products} onProductClick={handleProductClick} onGoProducts={navigateToProducts} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onGoHome={() => navigateTo('home')} onGoProducts={navigateToProducts} onGoAbout={() => navigateTo('about')} />
      <main key={currentView} className="flex-grow animate-view-enter pb-24 md:pb-0">
        {renderContent()}
      </main>
      <FloatingBottomNav 
        onHomeClick={() => navigateTo('home')} 
        onAboutClick={() => navigateTo('about')}
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
